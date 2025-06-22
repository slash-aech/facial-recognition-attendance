const pool = require('../config/timetableDbPool');

/**
 * Uploads rows to user_info table
 * @param {Array} rows - 2D array of sheet rows (excluding header)
 * @param {Function} parseRow - Function to extract [user_id, full_name, institute_email_id]
 * @param {String} user_role - e.g. 'teacher', 'student'
 * @param {String} institute_id - UUID of the institute
 * @param {String} dept_id - UUID of the department
 */
async function uploadToUserInfo(rows, parseRow, user_role, institute_id, dept_id) {
  const client = await pool.connect();

  try {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const [user_id, full_name, institute_email_id] = parseRow(row);

      if (!user_id || !full_name || !institute_email_id) {
        console.log(`⚠️ Skipping row ${i + 2}: missing required data.`);
        continue;
      }

      await client.query(
        `INSERT INTO user_info (
           user_id, full_name, institute_email_id, user_role, institute_id, dept_id
         )
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id) DO UPDATE SET
           full_name = EXCLUDED.full_name,
           institute_email_id = EXCLUDED.institute_email_id,
           institute_id = EXCLUDED.institute_id,
           dept_id = EXCLUDED.dept_id`,
        [user_id, full_name, institute_email_id, user_role, institute_id, dept_id]
      );

      console.log(`✔️ Row ${i + 2} uploaded for user_id: ${user_id}`);
    }

    console.log(`\n✅ Upload completed for role "${user_role}"`);
  } catch (err) {
    console.error('❌ Error uploading data:', err.message);
  } finally {
    client.release();
  }
}

module.exports = uploadToUserInfo;
