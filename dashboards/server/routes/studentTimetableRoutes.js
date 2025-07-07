const express = require('express');
const router = express.Router();
const { getStudentTimetable } = require('../controllers/studentTimetableController');
const { getStudentAttendanceTimetable } = require('../controllers/studentAttendanceTimetableController');

// Example route: /api/faculty/timetable?user_id=FACULTY123
router.get('/timetable', getStudentTimetable);
router.get('/attendance-timetable', getStudentAttendanceTimetable);

module.exports = router;