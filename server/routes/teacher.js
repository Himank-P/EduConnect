const express = require('express');
const router = express.Router();
const { readData } = require('../controllers/dataController');
const fs = require('fs');
const path = require('path');

router.get('/teacher/dashboard', readData('teacherCompleteData.json', 'dashboard'));
router.get('/teacher/profile-full', readData('teacherCompleteData.json', 'profileFull'));
router.get('/teacher/classes', readData('teacherCompleteData.json', 'classes'));
router.get('/teacher/detailed-attendance', readData('teacherCompleteData.json', 'detailedAttendance'));
router.get('/teacher/homeroom-timetable', readData('teacherCompleteData.json', 'homeroomTimetable')); 
router.get('/teacher/bus-duty', readData('teacherCompleteData.json', 'dashboard.busDuty'));

router.get('/teacher/homeroom', (req, res) => {
    const teacherDataPath = path.join(__dirname, '../data/teacherCompleteData.json');
    const studentDataPath = path.join(__dirname, '../data/teacherStudentData.json');
    fs.readFile(teacherDataPath, 'utf8', (err, teacherData) => {
        if (err) return res.status(500).json({ error: "Failed to read teacher config." });
        const homeClassName = JSON.parse(teacherData).dashboard.homeClass.className.split(' ')[0];
        fs.readFile(studentDataPath, 'utf8', (err, studentData) => {
            if (err) return res.status(500).json({ error: "Failed to read student data." });
            try {
                const allStudents = JSON.parse(studentData);
                const homeroomStudents = Object.values(allStudents.students).map(s => s.summary).filter(s => s.class.startsWith(homeClassName));
                res.status(200).json(homeroomStudents);
            } catch (parseErr) {
                res.status(500).json({ error: "Failed to parse student data." });
            }
        });
    });
});

router.get('/teacher/student-details/:id', (req, res) => {
    const { id } = req.params;
    const dataPath = path.join(__dirname, '../data/teacherStudentData.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read student data." });
        try {
            const jsonData = JSON.parse(data);
            const student = jsonData.students[id];
            if (student) {
                const fullDetails = { ...student.details, ...student.summary };
                res.status(200).json(fullDetails);
            } else {
                res.status(404).json({ error: "Student not found." });
            }
        } catch (parseErr) {
            res.status(500).json({ error: "Failed to parse student data." });
        }
    });
});

router.post('/upload/sheet', (req, res) => {
    const { sheetUrl, uploadType } = req.body;
    console.log(`Received a new ${uploadType} sheet for processing: ${sheetUrl}`);
    res.status(200).json({ message: `${uploadType} sheet link received successfully!` });
});

module.exports = router;

