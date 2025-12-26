const express = require('express');
const router = express.Router();
const { readData } = require('../controllers/dataController');
const guidanceController = require('../controllers/guidanceController');
const contactController = require('../controllers/contactController');

router.get('/alumni', readData('alumniData.json'));
router.get('/testimonials', readData('testimonialsData.json'));
router.get('/library-catalog', readData('libraryCatalogData.json'));

router.get('/guidance', guidanceController.getGuidance);

router.post('/contact', contactController.handleContactForm);

module.exports = router;

