const express = require('express');
const router = express.Router();
const {
  getAllInstitutes,
  getAllDepartments,
  getAllAcademicYears,
  getAllSemesters,
  getDepartmentsByInstitute,
  getAcademicCalendarBySemester
} = require('../controllers/superAdminController');

// Fetch all institutes
router.get('/institutes', getAllInstitutes);

// Fetch all departments (optional: by instituteId)
router.get('/departments', getAllDepartments);

// Fetch all academic years
router.get('/academic-years', getAllAcademicYears);

// Fetch all semesters (optional: by academicYearId or instituteId)
router.get('/semesters', getAllSemesters);

router.get('/:instituteId/departments', getDepartmentsByInstitute);

router.get('/:semesterId', getAcademicCalendarBySemester);

module.exports = router;
