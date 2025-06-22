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

const { customAlphabet } = require('nanoid');

const generateId = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12);

/**
 * Uploads student data into user_info and student_enrollment_information
 * @param {Array} rows - 2D array of sheet rows (excluding header)
 * @param {String} institute_id 
 * @param {String} dept_id 
 * @param {String} semester_year_id 
 * @param {String} academic_calendar_id 
 */
async function uploadStudentData(rows, institute_id, dept_id, semester_year_id, academic_calendar_id) {
  const client = await pool.connect();

  try {
    for (let i = 0; i < rows.length; i++) {
      const [user_id, full_name, branch, hostel_status, semNum, gender, join_type, student_phone, parent_phone, gnu_mail, personal_mail, batch_name, class_name] = rows[i].map(r => r.trim());

      if (!user_id || !full_name || !class_name || !batch_name || !semNum) continue;

      // Insert/update user_info
      await client.query(`
        INSERT INTO user_info (user_id, full_name, mobile_no, personal_email_id, parents_mobile_no, Types_of_Joining,
          institute_id, dept_id, user_role, institute_email_id, gender)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'student', $9, $10)
        ON CONFLICT (user_id) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          mobile_no = EXCLUDED.mobile_no,
          personal_email_id = EXCLUDED.personal_email_id,
          parents_mobile_no = EXCLUDED.parents_mobile_no,
          Types_of_Joining = EXCLUDED.Types_of_Joining,
          institute_email_id = EXCLUDED.institute_email_id,
          gender = EXCLUDED.gender;
      `, [user_id, full_name, student_phone, personal_mail, parent_phone, join_type, institute_id, dept_id, gnu_mail, gender.charAt(0)]);

      // Get or create timetable
      let timetableResult = await client.query(`SELECT id FROM timetable WHERE academic_calendar_id = $1 AND department_id = $2`, [academic_calendar_id, dept_id]);
      let timetable_id = timetableResult.rows[0]?.id;
      if (!timetable_id) {
        timetable_id = generateId();
        await client.query(`INSERT INTO timetable (id, academic_calendar_id, department_id) VALUES ($1, $2, $3)`, [timetable_id, academic_calendar_id, dept_id]);
      }

      // Get or create class
      let classResult = await client.query(`SELECT class_id FROM class WHERE name = $1 AND department_id = $2 AND institute_id = $3`, [class_name, dept_id, institute_id]);
      let class_id = classResult.rows[0]?.class_id;
      if (!class_id) {
        class_id = generateId();
        await client.query(`INSERT INTO class (class_id, name, department_id, institute_id, timetable_id) VALUES ($1, $2, $3, $4, $5)`, [class_id, class_name, dept_id, institute_id, timetable_id]);
      }

      // Get or create batch
      let batchResult = await client.query(`SELECT batch_id FROM batch WHERE name = $1 AND class_id = $2`, [batch_name, class_id]);
      let batch_id = batchResult.rows[0]?.batch_id;
      if (!batch_id) {
        batch_id = generateId();
        await client.query(`INSERT INTO batch (batch_id, name, class_id) VALUES ($1, $2, $3)`, [batch_id, batch_name, class_id]);
      }

      // Get or create semester (based on semester_year_id and semester_number)
      let semester_number = parseInt(semNum);
      let semesterQuery = await client.query(`SELECT id FROM semester WHERE semester_id = $1 AND semester_number = $2`, [semester_year_id, semester_number]);
      let semester_id = semesterQuery.rows[0]?.id;
      if (!semester_id) {
        semester_id = generateId();
        await client.query(`INSERT INTO semester (id, semester_id, semester_number) VALUES ($1, $2, $3)`, [semester_id, semester_year_id, semester_number]);
      }

      // Check if an entry exists for same student and semester already exists
      let enrollmentCheck = await client.query(`SELECT semester_id FROM student_enrollment_information WHERE student_id = $1`, [user_id]);
      let alreadyEnrolled = enrollmentCheck.rows.find(row => row.semester_id === semester_id);

      if (!alreadyEnrolled) {
        // Insert into student_enrollment_information with new semester
        await client.query(`
          INSERT INTO student_enrollment_information (student_id, class_id, batch_id, "Hosteller/Commutters", semester_id, timetable_id, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (student_id, semester_id) DO UPDATE SET
            class_id = EXCLUDED.class_id,
            batch_id = EXCLUDED.batch_id,
            "Hosteller/Commutters" = EXCLUDED."Hosteller/Commutters",
            timetable_id = EXCLUDED.timetable_id;
        `, [user_id, class_id, batch_id, hostel_status, semester_id, timetable_id, user_id]);
      }
    }

    console.log(`\n✅ Student data uploaded successfully.`);
  } catch (err) {
    console.error('❌ Error uploading student data:', err.message);
  } finally {
    client.release();
  }
}


module.exports = {
    uploadToUserInfo,
    uploadStudentData
};
