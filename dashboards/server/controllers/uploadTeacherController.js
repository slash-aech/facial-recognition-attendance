const xlsx = require('xlsx');
const db = require('../config/dbconfig'); // should expose `query` method

const uploadTeacherExcel = async (req, res) => {
  try {
    const fileBuffer = req.file?.buffer;
    const instituteId = req.body.instituteId;
    const deptId = req.body.deptId;

    if (!fileBuffer || !instituteId || !deptId) {
      return res.status(400).json({ success: false, error: 'File, Institute ID, or Department ID missing' });
    }

    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const allowedRoles = ['admin', 'hod', 'teacher'];
    const allowedGenders = ['M', 'F', 'O'];

    await db.query('BEGIN');

    for (const row of data) {
      const {
        user_id,
        full_name,
        email_id,
        mobile_no,
        user_role,
        gender
      } = row;

      // ✅ Role check
      const role = String(user_role || '').trim().toLowerCase();
      if (!allowedRoles.includes(role)) {
        throw new Error(`Invalid or unauthorized role in upload: ${user_role}`);
      }

      // ✅ Gender check
      const cleanGender = String(gender || '').toUpperCase();
      if (!allowedGenders.includes(cleanGender)) {
        throw new Error(`Invalid gender value for user_id ${user_id}: ${gender}`);
      }

      await db.query(
        `INSERT INTO user_info (
          user_id, full_name, email_id, mobile_no,
          user_role, gender, institute_id, dept_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (user_id) DO NOTHING`,
        [
          user_id,
          full_name,
          email_id,
          mobile_no,
          role,
          cleanGender,
          instituteId,
          deptId
        ]
      );
    }

    await db.query('COMMIT');
    return res.json({ success: true });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('❌ Teacher upload error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { uploadTeacherExcel };