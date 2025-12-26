const express = require('express');
const router = express.Router();
const messagingController = require('../controllers/messagingController');
const chatbotController = require('../controllers/chatbotController');

router.get('/messaging/contacts/:role', messagingController.getContacts);

router.post('/chatbot', chatbotController.handleChat);

module.exports = router;

