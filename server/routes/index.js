const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const teacherRoutes = require('./teacher');
const studentRoutes = require('./student');
const generalRoutes = require('./general');
const messagingRoutes = require('./messaging');

router.use(authRoutes);
router.use(adminRoutes);
router.use(teacherRoutes);
router.use(studentRoutes);
router.use(generalRoutes);
router.use(messagingRoutes);

module.exports = router;

