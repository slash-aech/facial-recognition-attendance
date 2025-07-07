// routes/uploadStudentExcel.js
const xlsx = require('xlsx');
const db = require('../config/dbconfig');

const uploadStudentExcel = async (req, res) => {
  try {
    const fileBuffer = req.file?.buffer;
    const { instituteId, deptId, semesterId } = req.body;

    if (!fileBuffer || !instituteId || !deptId || !semesterId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const allowedGenders = ['M', 'F', 'O'];
    await db.query('BEGIN');

    for (const row of data) {
      const {
        user_id,
        full_name,
        email_id,
        gender,
        mobile_no,
        class_short_name,
        group_id,
        parents_email_id,
        parents_mobile_no,
        address,
        city,
        state,
        country,
      } = row;

      if (!user_id || !email_id || !full_name || !class_short_name) {
        throw new Error(`Missing required fields for user_id: ${user_id}`);
      }

      const cleanGender = String(gender || '').toUpperCase();
      if (!allowedGenders.includes(cleanGender)) {
        throw new Error(`Invalid gender: ${gender} for ${user_id}`);
      }

      // ✅ Insert into user_info
      await db.query(
        `INSERT INTO user_info (
          user_id, full_name, email_id, mobile_no, gender,
          institute_id, dept_id, user_role,
          parents_email_id, parents_mobile_no,
          address, city, state, country
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, 'student',
          $8, $9,
          $10, $11, $12, $13
        )
        ON CONFLICT (user_id) DO NOTHING`,
        [
          user_id,
          full_name,
          email_id,
          mobile_no,
          cleanGender,
          instituteId,
          deptId,
          parents_email_id,
          parents_mobile_no,
          address,
          city,
          state,
          country,
        ]
      );

      // ✅ Resolve class_id and timetable_id from class table
      const classRes = await db.query(
        `SELECT class_id, timetable_id FROM class 
         WHERE short = $1 AND institute_id = $2 AND department_id = $3 LIMIT 1`,
        [class_short_name, instituteId, deptId]
      );

      if (classRes.rowCount === 0) {
        throw new Error(`Class with short name '${class_short_name}' not found`);
      }

      const { class_id, timetable_id } = classRes.rows[0];

      // ✅ Insert into student_enrollment_information
      await db.query(`
          INSERT INTO student_enrollment_information (
          class_id, group_id, semester_id, timetable_id, user_id
          ) VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (semester_id, user_id) DO NOTHING
          `, [class_id, group_id, semesterId, timetable_id, user_id]);
    }

    await db.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('❌ Upload error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { uploadStudentExcel };
