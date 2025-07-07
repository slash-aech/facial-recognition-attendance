const pool = require('../config/dbconfig');

// Fetch all institutes
const getAllInstitutes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM institute');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch institutes', details: err.message });
  }
};

// Fetch all departments (optional: filter by institute_id)
const getAllDepartments = async (req, res) => {
  try {
    const { instituteId } = req.query;
    const query = instituteId
      ? 'SELECT * FROM department WHERE institute_id = $1'
      : 'SELECT * FROM department';
    const values = instituteId ? [instituteId] : [];

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments', details: err.message });
  }
};

// Fetch all academic years
const getAllAcademicYears = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM academic_year ORDER BY start_year DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch academic years', details: err.message });
  }
};

// Fetch all semesters (optional: filter by academic_year_id or institute_id)
const getAllSemesters = async (req, res) => {
  try {
    const { academicYearId, instituteId } = req.query;
    let query = 'SELECT * FROM semester_year';
    const values = [];

    if (academicYearId && instituteId) {
      query += ' WHERE academic_year_id = $1 AND institute_id = $2';
      values.push(academicYearId, instituteId);
    } else if (academicYearId) {
      query += ' WHERE academic_year_id = $1';
      values.push(academicYearId);
    } else if (instituteId) {
      query += ' WHERE institute_id = $1';
      values.push(instituteId);
    }
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch semesters', details: err.message });
  }
};

// Get departments by institute ID (from URL param)
const getDepartmentsByInstitute = async (req, res) => {
  const { instituteId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM department WHERE institute_id = $1',
      [instituteId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments by institute', details: err.message });
  }
};

const getAcademicCalendarBySemester = async (req, res) => {
  const { semesterId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM academic_calendar WHERE semester_id = $1',
      [semesterId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No calendar found for this semester' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch academic calendar',
      details: err.message,
    });
  }
};

const getSemestersBySemesterYearId = async (req, res) => {
  const { semesterYearId } = req.params;

  if (!semesterYearId) {
    console.log("Missing semesterYearId");
    return res.status(400).json({ message: 'Missing semesterYearId' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM semester WHERE semester_year_id = $1',
      [semesterYearId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No semesters found for this semesterYearId' });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching semester rows:", err);
    res.status(500).json({
      error: 'Failed to fetch semester rows',
      details: err.message,
    });
  }
};

module.exports = {
  getAllInstitutes,
  getAllDepartments,
  getAllAcademicYears,
  getAllSemesters,
  getDepartmentsByInstitute,
  getAcademicCalendarBySemester,
  getSemestersBySemesterYearId
};
