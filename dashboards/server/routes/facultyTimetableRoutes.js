const express = require('express');
const router = express.Router();
const { getFacultyTimetable } = require('../controllers/facultyTimetableController');

// Example route: /api/faculty/timetable?user_id=FACULTY123
router.get('/timetable', getFacultyTimetable);

module.exports = router;