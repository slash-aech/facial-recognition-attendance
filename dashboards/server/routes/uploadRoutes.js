const express = require('express');
const router = express.Router();
const { uploadStudentData, uploadTeacherTimeTable, uploadClassTimeTable} = require('../utils/uploadToUserinfo');
const fetchGoogleSheet = require('../utils/fetchGoogleSheet');
const pool = require('../config/timetableDbPool');

function parseFacultyRow(row) {
  const user_id = row[2]?.trim();
  const full_name = row[3]?.trim();
  const institute_email_id = row[4]?.trim();
  const short = row[1]?.trim();
  return { user_id, full_name, institute_email_id, short };
}

router.post('/upload-students', async (req, res) => {
  const { rows, institute_id, dept_id, semester_year_id, academic_calendar_id } = req.body;

  if (!rows || !institute_id || !dept_id || !semester_year_id || !academic_calendar_id) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    await uploadStudentData(rows, institute_id, dept_id, semester_year_id, academic_calendar_id);
    return res.status(200).json({ message: 'Student data uploaded successfully.' });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({ error: 'Internal server error while uploading student data.' });
  }
});

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

    for (let i = 1; i < rows.length; i++) {
      const { user_id, full_name, institute_email_id, short } = parseFacultyRow(rows[i]);

      if (!user_id || !full_name || !institute_email_id) {
        console.log(`⚠️ Skipping row ${i + 1}: missing required data.`);
        continue;
      }

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

      const result = await client.query(`SELECT id FROM user_info WHERE user_id = $1`, [user_id]);
      const user_info_id = result.rows[0]?.id;

      if (user_info_id) {
        const hashedPassword = await bcrypt.hash(user_id, 10);

        await client.query(`
          INSERT INTO user_authentication (email_id, password, user_info_id)
          VALUES ($1, $2, $3)
          ON CONFLICT (email_id) DO UPDATE SET
            password = EXCLUDED.password,
            user_info_id = EXCLUDED.user_info_id;
        `, [institute_email_id, hashedPassword, user_info_id]);
      }

      await client.query(
        `INSERT INTO teacher_enrollment_info (user_id, tt_display_full_name, short, timetable_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO UPDATE SET
           tt_display_full_name = EXCLUDED.tt_display_full_name,
           short = EXCLUDED.short,
           timetable_id = EXCLUDED.timetable_id`,
        [user_id, full_name, short, timetable_id]
      );

      console.log(`✔️ Processed faculty user_id: ${user_id}`);
    }

    res.status(200).json({ message: 'Faculty data uploaded successfully.' });
  } catch (error) {
    console.error('❌ Upload Error:', error.message);
    res.status(500).json({ message: 'Error uploading faculty data.', error: error.message });
  } finally {
    client.release();
  }
});


router.post('/upload-teacher-timetable', async (req, res) => {
  const { spreadsheet_id, sheet_name, academic_calendar_id, teacher_enrollment_info_id, dept_id, institute_id } = req.body;

  // Validation
  if (!spreadsheet_id || !sheet_name || !academic_calendar_id || !teacher_enrollment_info_id || !dept_id || !institute_id) {
    return res.status(400).json({
      message: 'Missing required fields: spreadsheet_id, sheet_name, academic_calendar_id, teacher_enrollment_info_id, dept_id, institute_id'
    });
  }

  try {
    const sheetData = await fetchGoogleSheet(spreadsheet_id, sheet_name);

    if (!sheetData || sheetData.length === 0) {
      return res.status(400).json({ message: 'No data found in the sheet.' });
    }

    await uploadTeacherTimeTable(
      sheetData,
      academic_calendar_id,
      teacher_enrollment_info_id,
      dept_id,
      institute_id
    );

    res.status(200).json({ message: '✅ Teacher timetable uploaded successfully.' });
  } catch (error) {
    console.error('❌ Route error:', error.message);
    res.status(500).json({ message: 'Failed to upload timetable.', error: error.message });
  }
});

router.post('/upload-class-timetable', async (req, res) => {
  const {
    spreadsheet_id,
    sheet_name,
    academic_calendar_id,
    class_id,
    dept_id
  } = req.body;

  if (
    !spreadsheet_id ||
    !sheet_name ||
    !academic_calendar_id ||
    !class_id ||
    !dept_id
  ) {
    return res.status(400).json({
      error: 'Missing required fields: spreadsheet_id, sheet_name, academic_calendar_id, class_id, dept_id',
    });
  }

  try {
    const data = await fetchGoogleSheet(spreadsheet_id, sheet_name);
    if (!data || !data.length) {
      return res.status(400).json({ error: 'No data found in the provided Google Sheet.' });
    }

    await uploadClassTimeTable(data, academic_calendar_id, class_id, dept_id);

    res.status(200).json({ message: '✅ Class timetable uploaded successfully.' });
  } catch (err) {
    console.error('❌ Upload failed:', err.message);
    res.status(500).json({ error: 'Failed to upload class timetable', details: err.message });
  }
});


module.exports = router;
