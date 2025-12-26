const express = require('express');
const router = express.Router();
const path = require('path'); 
const fs = require('fs').promises;
const { readData } = require('../controllers/dataController');
const timetableController = require('../controllers/timetableController');
const transferController = require('../controllers/transferController');
const hostelController = require('../controllers/hostelController');

router.get('/admin/dashboard', readData('adminData.json', 'dashboard'));
router.get('/admin/transport', readData('adminData.json', 'transport'));
router.get('/admin/hostel', readData('adminData.json', 'hostel'));
router.get('/admin/library', readData('adminData.json', 'library'));
router.get('/admin/finances', readData('adminData.json', 'finances'));
router.get('/admin/placements', readData('adminData.json', 'placements'));
router.get('/admin/labs', readData('adminData.json', 'labs'));
router.get('/admin/registered-schools', readData('schools.json'));
router.post('/admin/hostel/allocate', hostelController.allocateRooms);

router.get('/admin/students', readData('adminData.json', 'students'));
router.get('/admin/teachers', readData('adminData.json', 'teachers'));
router.get('/admin/staff', readData('adminData.json', 'staff'));
router.get('/admin/student-data-package/:id', transferController.getStudentDataPackage);
router.post('/admin/import-student', transferController.importStudentDataPackage);

router.post('/admin/generate-timetable', timetableController.generateTimetable);

router.get('/admin/:section(students|teachers|staff)', (req, res) => {
    const { section } = req.params;
    const dataPath = path.join(__dirname, '../data/adminData.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read admin data." });
        try {
            const jsonData = JSON.parse(data);
            const sectionData = jsonData[section];
            if (!sectionData) return res.status(404).json({ error: "Section not found." });
            res.status(200).json(Object.values(sectionData));
        } catch (parseErr) {
            res.status(500).json({ error: "Failed to parse admin data." });
        }
    });
});

router.get('/admin/:section', readData('adminData.json'));

router.get('/admin/student-details/:id', (req, res) => {
    const { id } = req.params;
    readData('adminData.json', `students.${id}`)(req, res);
});
router.get('/admin/teacher-details/:id', (req, res) => {
    const { id } = req.params;
    readData('adminData.json', `teachers.${id}`)(req, res);
});
router.get('/admin/staff-details/:id', (req, res) => {
    const { id } = req.params;
    readData('adminData.json', `staff.${id}`)(req, res);
});
router.get('/admin/transport/route/:routeName', (req, res) => {
    const { routeName } = req.params;
    readData('adminData.json', `transport.routes.${routeName}`)(req, res);
});
router.get('/admin/hostel/room/:roomId', async (req, res) => {
    const { roomId } = req.params;
    const adminDataPath = path.join(__dirname, '../data/adminData.json');
    try {
        const data = await fs.readFile(adminDataPath, 'utf8');
        const adminData = JSON.parse(data);
        const room = adminData.hostel?.rooms?.find(r => r.roomId === roomId);

        if (room) {
            const config = adminData.hostelConfig?.find(c => c.buildingId === room.buildingId);
            res.status(200).json({
                roomId: room.roomId,
                buildingId: room.buildingId,
                occupants: room.occupants || [],
                consumption: config?.consumption || { electricity: "N/A", water: "N/A"}, 
                assets: config?.defaultAssets || ["Bed", "Table", "Chair"], 
                complaint: "None" 
            });
        } else {
            res.status(404).json({ error: "Room details not found or not allocated." });
        }
    } catch (error) {
        console.error(`Error reading or parsing adminData for room ${roomId}:`, error);
        res.status(500).json({ error: "Failed to retrieve room details." });
    }
});


module.exports = router;

