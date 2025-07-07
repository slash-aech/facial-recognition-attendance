const express = require('express');
const router = express.Router();
const { getFacultyActiveToday } = require('../controllers/facultyAttendanceController');

router.get('/faculty/active-today', getFacultyActiveToday);

module.exports = router;
