const fs = require('fs').promises;
const path = require('path');
// Corrected: Use db instance from firebaseAdmin
const { db, admin } = require('../firebaseAdmin'); // Import admin for Timestamp if needed

const adminDataPath = path.join(__dirname, '../data/adminData.json');
const studentProfileDataPath = path.join(__dirname, '../data/studentProfileData.json');

const readJson = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
        throw new Error(`Could not read data file: ${path.basename(filePath)}`);
    }
};

const writeJson = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing file ${filePath}:`, err);
        throw new Error(`Could not save data file: ${path.basename(filePath)}`);
    }
};

exports.allocateRooms = async (req, res) => {
    try {
        const adminData = await readJson(adminDataPath);
        const { hostelConfig, students } = adminData;

        if (!hostelConfig || !students) {
            return res.status(400).json({ error: 'Hostel configuration or student data missing in adminData.json' });
        }

        const studentsNeedingHostel = Object.values(students)
            .filter(s => s.hostelService === 'Yes' && !s.allocatedRoom);

        if (studentsNeedingHostel.length === 0) {
            return res.status(200).json({ message: 'No students require hostel allocation at this time.' });
        }

        const boys = studentsNeedingHostel.filter(s => s.gender === 'Male');
        const girls = studentsNeedingHostel.filter(s => s.gender === 'Female');

        const newAllocations = [];
        let allocationLog = [];

        const allocateGender = (list, gender) => {
            const buildings = hostelConfig.filter(b => b.gender === gender);
            let studentIndex = 0;

            for (const building of buildings) {
                for (let roomNum = 1; roomNum <= building.totalRooms; roomNum++) {
                    const roomId = `${building.buildingId}-${roomNum}`;
                    const occupants = [];

                    for (let i = 0; i < building.capacityPerRoom; i++) {
                        if (studentIndex < list.length) {
                            const student = list[studentIndex];
                            occupants.push(student.id);
                            student.allocatedRoom = roomId;
                            allocationLog.push({ studentId: student.id, name: student.name, room: roomId });
                            studentIndex++;
                        } else {
                            break;
                        }
                    }

                    if (occupants.length > 0) {
                        newAllocations.push({ roomId, buildingId: building.buildingId, occupants });
                    }
                     if (studentIndex >= list.length) {
                         break;
                     }
                }
                 if (studentIndex >= list.length) {
                     break;
                 }
            }
            if (studentIndex < list.length) {
                console.warn(`Warning: Not enough ${gender} hostel rooms for ${list.length - studentIndex} students.`);
                allocationLog.push({ warning: `Could not allocate rooms for ${list.length - studentIndex} ${gender} students.` });
            }
        };

        allocateGender(boys, 'Boys');
        allocateGender(girls, 'Girls');

        adminData.hostel.rooms = newAllocations;

        try {
            const studentProfileData = await readJson(studentProfileDataPath);
            allocationLog.forEach(logEntry => {
                 if (logEntry.studentId && logEntry.studentId === studentProfileData.user?.id) {
                     if (!studentProfileData.hostel) studentProfileData.hostel = {};
                    studentProfileData.hostel.allottedRoom = logEntry.room;
                }
            });
            await writeJson(studentProfileDataPath, studentProfileData);

        } catch (profileError) {
             console.error("Could not update studentProfileData.json:", profileError.message);
             allocationLog.push({ error: "Failed to update individual student dashboard data." });
        }


        await writeJson(adminDataPath, adminData);

        res.status(200).json({
            message: 'Hostel allocation process completed.',
            summary: allocationLog
        });

    } catch (error) {
        console.error('Hostel allocation failed:', error);
        res.status(500).json({ error: error.message || 'An internal server error occurred during hostel allocation.' });
    }
};

exports.handleIssueReport = async (req, res) => {
    console.log("Received issue report request body:", req.body);
     try {
         const { description, studentName, studentEmail } = req.body;
         if (!description || !studentName || !studentEmail) {
             return res.status(400).json({ error: 'Missing required fields (description, studentName, studentEmail).' });
         }

         const docRef = await db.collection("hostel_issues").add({
             studentName: studentName,
             studentEmail: studentEmail,
             description: description,
             status: 'Pending',
             createdAt: admin.firestore.FieldValue.serverTimestamp()
         });
         res.status(201).json({ message: 'Issue reported successfully via backend.', id: docRef.id });

     } catch (error) {
         console.error("Backend issue report error:", error);
         res.status(500).json({ error: "Failed to save issue report via backend." });
     }
};

exports.handleRoomChangeRequest = async (req, res) => {
    console.log("Received room change request body:", req.body);
     try {
        const { reason, preferredRoommate, studentName, studentEmail } = req.body;
        if (!reason || !studentName || !studentEmail) {
             return res.status(400).json({ error: 'Missing required fields (reason, studentName, studentEmail).' });
         }

        const docRef = await db.collection("hostel_requests").add({
            studentName: studentName,
            studentEmail: studentEmail,
            reason: reason,
            preferredRoommate: preferredRoommate || 'None',
            status: 'Pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(201).json({ message: 'Room change requested successfully via backend.', id: docRef.id });

     } catch (error) {
         console.error("Backend room change request error:", error);
         res.status(500).json({ error: "Failed to save room change request via backend." });
     }
};

exports.getStudentRequests = async (req, res) => {
     const userEmail = req.query.email;
     console.log("Fetching requests for user email (from query param):", userEmail);
     if (!userEmail) return res.status(400).json({ error: 'User email query parameter is required.' });

     try {
         const issuesRef = db.collection("hostel_issues");
         const requestsRef = db.collection("hostel_requests");

         // Use Admin SDK's .where() and .orderBy().get()
         const qIssues = issuesRef.where("studentEmail", "==", userEmail).orderBy("createdAt", "desc");
         const qRequests = requestsRef.where("studentEmail", "==", userEmail).orderBy("createdAt", "desc");

         const [issuesSnapshot, requestsSnapshot] = await Promise.all([
             qIssues.get(),
             qRequests.get()
         ]);

         const issues = issuesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Issue Report' }));
         const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'Room Change' }));

         const allItems = [...issues, ...requests];
          // Sort using Admin SDK Timestamp's _seconds property
         allItems.sort((a, b) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0));


         res.status(200).json(allItems);

     } catch (error) {
         console.error("Backend get requests error:", error);
         res.status(500).json({ error: "Failed to fetch student requests via backend." });
     }
};

