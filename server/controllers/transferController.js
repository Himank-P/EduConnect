const fs = require('fs');
const path = require('path');

// Helper to safely read a JSON file
const readJson = async (filePath) => {
    try {
        const data = await fs.promises.readFile(path.join(__dirname, '../data', filePath), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') return []; // Return empty array if file doesn't exist
        console.error(`Error reading ${filePath}:`, err);
        return null;
    }
};

// This is your existing function to generate the package for EXPORT
exports.getStudentDataPackage = async (req, res) => {
    const { id } = req.params;
    try {
        const [ adminData, studentProfile, userProfile, attendance, grades, library, hostel, transport, fees ] = await Promise.all([
            readJson('adminData.json'), readJson('studentProfileData.json'), readJson('userProfileFullData.json'),
            readJson('attendanceData.json'), readJson('gradesData.json'), readJson('libraryData.json'),
            readJson('hostelData.json'), readJson('studentTransportData.json'), readJson('feesData.json')
        ]);
        
        const studentInfo = adminData.students[id];
        if (!studentInfo) {
            return res.status(404).json({ error: "Student not found." });
        }

        const dataPackage = {
            studentDetails: studentInfo,
            profile: userProfile,
            academicRecord: { grades: grades, attendance: attendance, extracurriculars: studentProfile.extracurriculars },
            financialRecord: { fees: fees },
            services: { library: library, hostel: hostel, transport: transport }
        };
        res.status(200).json(dataPackage);
    } catch (error) {
        console.error("Error creating student data package:", error);
        res.status(500).json({ error: "Failed to compile student data package." });
    }
};

// **FIXED:** This function now imports the student to your main 'students.json' file
exports.importStudentDataPackage = async (req, res) => {
    const dataPackage = req.body;
    if (!dataPackage || !dataPackage.studentDetails || !dataPackage.studentDetails.id) {
        return res.status(400).json({ error: "Invalid or missing student data in package." });
    }

    const filePath = path.join(__dirname, '../data/students.json');
    
    try {
        let students = await readJson('students.json');
        if (!Array.isArray(students)) students = [];

        const studentId = dataPackage.studentDetails.id;
        
        // Check if student is already in the login file
        if (students.find(student => student.studentId === studentId)) {
            return res.status(409).json({ error: `Student ${studentId} already exists in the system.` });
        }

        // Extract data from the package to create a new student login account
        const newStudent = {
            id: Date.now(),
            email: `imported.${studentId.toLowerCase()}@educonnect.app`, // Create a placeholder email
            fullName: dataPackage.studentDetails.name,
            studentId: studentId,
            dob: dataPackage.profile?.personalDetails?.['Date of Birth'] || 'N/A',
            parentName: 'N/A',
            password: "temp_password_123", // Set a temporary password
            registeredOn: new Date().toISOString()
        };

        students.push(newStudent);
        
        await fs.promises.writeFile(filePath, JSON.stringify(students, null, 2));
        res.status(201).json({ message: `Student ${newStudent.fullName} imported successfully with a temporary password.` });
    } catch (writeErr) {
        console.error("Error saving imported student data:", writeErr);
        res.status(500).json({ error: "Failed to save imported data on the server." });
    }
};

