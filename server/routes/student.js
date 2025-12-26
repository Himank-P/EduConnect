const express = require('express');
const router = express.Router();
const { readData } = require('../controllers/dataController');
const recommendationController = require('../controllers/recommendationController');
const hostelController = require('../controllers/hostelController'); 

router.get('/student-profile', readData('studentProfileData.json', 'user'));
router.get('/user-profile-full', readData('studentProfileData.json','fullProfile'));
router.get('/fees', readData('studentProfileData.json', 'fees'));
router.get('/fee-summary', readData('studentProfileData.json', 'fees'));
router.get('/student/library', readData('studentProfileData.json', 'library'));
router.get('/student/hostel', readData('studentProfileData.json', 'hostel'));
router.get('/attendance', readData('studentProfileData.json', 'attendance'));
router.get('/student/grades', readData('studentProfileData.json', 'reportCard'));
router.get('/timetable', readData('studentProfileData.json', 'timetable'));
router.get('/student/transport', readData('studentProfileData.json', 'transport'));
router.get('/school', readData('studentProfileData.json', 'school'));
router.get('/campus-life', readData('studentProfileData.json', 'campusLife'));
router.get('/extracurriculars', readData('studentProfileData.json','extracurriculars'));
router.get('/student-interests', readData('studentProfileData.json'));
router.get('/student/recommendations', recommendationController.getRecommendations);

router.post('/student/hostel/report-issue', hostelController.handleIssueReport);
router.post('/student/hostel/request-change', hostelController.handleRoomChangeRequest);
router.get('/student/hostel/my-requests', hostelController.getStudentRequests);

module.exports = router;

