const express = require('express');
const router = express.Router();
const { uploadStudentData, uploadTeacherTimeTable } = require('../utils/uploadToUserinfo');
const fetchGoogleSheet = require('../utils/fetchGoogleSheet');
const pool = require('../config/timetableDbPool');

// Parse faculty rows
function parseFacultyRow(row) {
  const user_id = row[2]?.trim(); // Employee ID
  const full_name = row[3]?.trim();
  const institute_email_id = row[4]?.trim();
  const short = row[1]?.trim(); // Short Name
  return { user_id, full_name, institute_email_id, short };
}

router.post('/faculties', async (req, res) => {
  const { spreadsheet_id, sheet_name, institute_id, dept_id, academic_calendar_id } = req.body;

  if (!spreadsheet_id || !sheet_name || !institute_id || !dept_id || !academic_calendar_id) {
    return res.status(400).json({
      message: 'Missing required fields: spreadsheet_id, sheet_name, institute_id, dept_id, academic_calendar_id',
    });
  }

  const client = await pool.connect();

  try {
    const rows = await fetchGoogleSheet(spreadsheet_id, sheet_name);
    if (!rows.length) return res.status(400).json({ message: 'No data found in the sheet.' });

    // Step 1: Get or Create timetable
    const timetableResult = await client.query(
      `SELECT id FROM timetable WHERE academic_calendar_id = $1 AND department_id = $2 LIMIT 1`,
      [academic_calendar_id, dept_id]
    );

    let timetable_id;

    if (timetableResult.rows.length > 0) {
      timetable_id = timetableResult.rows[0].id;
    } else {
      const insertResult = await client.query(
        `INSERT INTO timetable (academic_calendar_id, department_id)
         VALUES ($1, $2) RETURNING id`,
        [academic_calendar_id, dept_id]
      );
      timetable_id = insertResult.rows[0].id;
    }

    // Step 2: Upload each faculty
    for (let i = 1; i < rows.length; i++) {
      const { user_id, full_name, institute_email_id, short } = parseFacultyRow(rows[i]);

      if (!user_id || !full_name || !institute_email_id) {
        console.log(`⚠️ Skipping row ${i + 1}: missing required data.`);
        continue;
      }

      // Insert/update user_info
      await client.query(
        `INSERT INTO user_info (user_id, full_name, institute_email_id, user_role, institute_id, dept_id)
         VALUES ($1, $2, $3, 'teacher', $4, $5)
         ON CONFLICT (user_id) DO UPDATE SET
           full_name = EXCLUDED.full_name,
           institute_email_id = EXCLUDED.institute_email_id,
           institute_id = EXCLUDED.institute_id,
           dept_id = EXCLUDED.dept_id`,
        [user_id, full_name, institute_email_id, institute_id, dept_id]
      );

      // Insert/update teacher_enrollment_info
      await client.query(
        `INSERT INTO teacher_enrollment_info (user_id, tt_display_full_name, short, timetable_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO UPDATE SET
           tt_display_full_name = EXCLUDED.tt_display_full_name,
           short = EXCLUDED.short,
           timetable_id = EXCLUDED.timetable_id`,
        [user_id, full_name, short, timetable_id]
      );

      console.log(`✔️ Processed user_id: ${user_id}`);
    }

    res.status(200).json({ message: 'Faculty data uploaded successfully.' });
  } catch (error) {
    console.error('❌ Upload Error:', error.message);
    res.status(500).json({ message: 'Error uploading faculty data.', error: error.message });
  } finally {
    client.release();
  }
});

router.post('/upload-students', async (req, res) => {
  const { rows, institute_id, dept_id, semester_year_id, academic_calendar_id } = req.body;

  if (!Array.isArray(rows) || !institute_id || !dept_id || !semester_year_id || !academic_calendar_id) {
    return res.status(400).json({ error: 'Missing required fields or invalid data format' });
  }

  try {
    await uploadStudentData(rows, institute_id, dept_id, semester_year_id, academic_calendar_id);
    res.status(200).json({ message: 'Student data uploaded successfully.' });
  } catch (err) {
    console.error('Upload failed:', err.message);
    res.status(500).json({ error: 'Failed to upload student data', details: err.message });
  }
});

router.post('/upload-teacher-timetable', async (req, res) => {
  const {
    data,
    academic_year_id,
    semester_year_id,
    academic_calendar_id,
    facultyShort,
    dept_id,
    institute_id
  } = req.body;

  if (
    !Array.isArray(data) ||
    !academic_year_id ||
    !semester_year_id ||
    !academic_calendar_id ||
    !facultyShort ||
    !dept_id ||
    !institute_id
  ) {
    return res.status(400).json({
      error: 'Missing or invalid fields. Required: data, academic_year_id, semester_year_id, academic_calendar_id, facultyShort, dept_id, institute_id',
    });
  }

  try {
    await uploadTeacherTimeTable(data, academic_year_id, semester_year_id, academic_calendar_id, facultyShort, dept_id, institute_id);
    res.status(200).json({ message: 'Teacher timetable uploaded successfully.' });
  } catch (err) {
    console.error('Upload failed:', err.message);
    res.status(500).json({ error: 'Failed to upload teacher timetable', details: err.message });
  }
});

module.exports = router;
