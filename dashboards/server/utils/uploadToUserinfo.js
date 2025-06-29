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
      const [
        user_id, full_name, branch, hostel_status, semNum, gender, join_type,
        student_phone, parent_phone, gnu_mail, personal_mail, batch_name, class_name
      ] = rows[i].map(r => r.trim());

      if (!user_id || !full_name || !class_name || !batch_name || !semNum) continue;

      // 1. Insert/update into user_info
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
      `, [
        user_id, full_name, student_phone, personal_mail, parent_phone, join_type,
        institute_id, dept_id, gnu_mail, gender.charAt(0)
      ]);

      // 2. Get user_info.id (PK)
      const userInfoResult = await client.query(`SELECT id FROM user_info WHERE user_id = $1`, [user_id]);
      const user_info_id = userInfoResult.rows[0]?.id;

      // 3. Insert/update into user_authentication
      if (user_info_id) {
        const hashedPassword = await bcrypt.hash(user_id, 10); // Can be changed to any password logic

        await client.query(`
          INSERT INTO user_authentication (email_id, password, user_info_id)
          VALUES ($1, $2, $3)
          ON CONFLICT (email_id) DO UPDATE SET
            password = EXCLUDED.password,
            user_info_id = EXCLUDED.user_info_id;
        `, [gnu_mail, hashedPassword, user_info_id]);
      }

      // 4. Get or create timetable
      let timetableResult = await client.query(`
        SELECT id FROM timetable WHERE academic_calendar_id = $1 AND department_id = $2
      `, [academic_calendar_id, dept_id]);

      let timetable_id = timetableResult.rows[0]?.id;
      if (!timetable_id) {
        timetable_id = generateId();
        await client.query(`
          INSERT INTO timetable (id, academic_calendar_id, department_id)
          VALUES ($1, $2, $3)
        `, [timetable_id, academic_calendar_id, dept_id]);
      }

      // 5. Get or create class
      let classResult = await client.query(`
        SELECT class_id FROM class WHERE name = $1 AND department_id = $2 AND institute_id = $3
      `, [class_name, dept_id, institute_id]);

      let class_id = classResult.rows[0]?.class_id;
      if (!class_id) {
        class_id = generateId();
        await client.query(`
          INSERT INTO class (class_id, name, department_id, institute_id, timetable_id)
          VALUES ($1, $2, $3, $4, $5)
        `, [class_id, class_name, dept_id, institute_id, timetable_id]);
      }

      // 6. Get or create batch
      let batchResult = await client.query(`
        SELECT batch_id FROM batch WHERE name = $1 AND class_id = $2
      `, [batch_name, class_id]);

      let batch_id = batchResult.rows[0]?.batch_id;
      if (!batch_id) {
        batch_id = generateId();
        await client.query(`
          INSERT INTO batch (batch_id, name, class_id)
          VALUES ($1, $2, $3)
        `, [batch_id, batch_name, class_id]);
      }

      // 7. Get or create semester
      let semester_number = parseInt(semNum);
      let semesterQuery = await client.query(`
        SELECT id FROM semester WHERE semester_id = $1 AND semester_number = $2
      `, [semester_year_id, semester_number]);

      let semester_id = semesterQuery.rows[0]?.id;
      if (!semester_id) {
        semester_id = generateId();
        await client.query(`
          INSERT INTO semester (id, semester_id, semester_number)
          VALUES ($1, $2, $3)
        `, [semester_id, semester_year_id, semester_number]);
      }

      // 8. Check if already enrolled in that semester
      let enrollmentCheck = await client.query(`
        SELECT semester_id FROM student_enrollment_information WHERE student_id = $1
      `, [user_id]);

      let alreadyEnrolled = enrollmentCheck.rows.find(row => row.semester_id === semester_id);

      if (!alreadyEnrolled) {
        // 9. Insert into student_enrollment_information
        await client.query(`
          INSERT INTO student_enrollment_information (
            student_id, class_id, batch_id, "Hosteller/Commutters", semester_id, timetable_id, user_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (student_id, semester_id) DO UPDATE SET
            class_id = EXCLUDED.class_id,
            batch_id = EXCLUDED.batch_id,
            "Hosteller/Commutters" = EXCLUDED."Hosteller/Commutters",
            timetable_id = EXCLUDED.timetable_id;
        `, [user_id, class_id, batch_id, hostel_status, semester_id, timetable_id, user_id]);
      }
    }

    console.log(`✅ Student data uploaded successfully.`);
  } catch (err) {
    console.error('❌ Error uploading student data:', err.message);
  } finally {
    client.release();
  }
}

async function uploadTeacherTimeTable(data, academic_calendar_id, facultyShort, dept_id, institute_id) {
  const client = await pool.connect();
  try {
    const header = data[0];

    // Find teacher
    const teacherRes = await client.query(
      `SELECT * FROM teacher_enrollment_info WHERE short = $1`,
      [facultyShort]
    );
    if (teacherRes.rowCount === 0) throw new Error('Teacher not found');
    const teacher = teacherRes.rows[0];

    // Get or create timetable
    let timetable_id = teacher.timetable_id;
    if (!timetable_id) {
      const existing = await client.query(
        `SELECT id FROM timetable WHERE academic_calendar_id = $1 AND department_id = $2`,
        [academic_calendar_id, dept_id]
      );
      timetable_id = existing.rows[0]?.id;
      if (!timetable_id) {
        timetable_id = generateId();
        await client.query(
          `INSERT INTO timetable (id, academic_calendar_id, department_id)
           VALUES ($1, $2, $3)`,
          [timetable_id, academic_calendar_id, dept_id]
        );
      }
    }

    // Loop through timetable rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const day = row[0];

      for (let j = 1; j < header.length; j++) {
        const periodText = header[j];
        const entry = row[j];

        if (!entry || entry.trim() === 'Break' || entry.trim() === 'No Teaching Load') continue;

        const lines = entry.split(/\r?\n/);
        const [subjectLine, classLine, teacherShort, roomLine, typeLine] = lines;

        const subjectId = subjectLine.split('(')[0].trim();
        const subjectName = subjectLine.split('(')[1]?.replace(')', '').trim() || subjectId;

        const classShort = classLine.split('(')[0].trim();
        const batchShort = classLine.split('(')[1]?.replace(')', '').trim() || classShort;

        const lessonType = typeLine === '2' ? 'Lab' : 'Lecture';
        const classroom_id = roomLine.trim();

        // ➤ Subject
        const subjectRes = await client.query(
          `SELECT subject_id FROM subject WHERE subject_id = $1 AND timetable_id = $2`,
          [subjectId, timetable_id]
        );
        if (subjectRes.rowCount === 0) {
          await client.query(
            `INSERT INTO subject (subject_id, name, short, timetable_id)
             VALUES ($1, $2, $3, $4)`,
            [subjectId, subjectName, subjectId, timetable_id]
          );
        }

        // ➤ Class
        let classRes = await client.query(
          `SELECT class_id FROM class WHERE short = $1 AND department_id = $2`,
          [classShort, dept_id]
        );
        let class_id = classRes.rows[0]?.class_id;
        if (!class_id) {
          class_id = generateId();
          await client.query(
            `INSERT INTO class (class_id, name, short, department_id, institute_id, timetable_id)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [class_id, classShort, classShort, dept_id, institute_id, timetable_id]
          );
        }

        // ➤ Batch
        let batchRes = await client.query(
          `SELECT batch_id FROM batch WHERE short = $1 AND class_id = $2`,
          [batchShort, class_id]
        );
        let batch_id = batchRes.rows[0]?.batch_id;
        if (!batch_id) {
          batch_id = generateId();
          await client.query(
            `INSERT INTO batch (batch_id, name, short, class_id)
             VALUES ($1, $2, $3, $4)`,
            [batch_id, batchShort, batchShort, class_id]
          );
        }

        // ➤ Classroom
        let roomRes = await client.query(
          `SELECT classroom_id FROM classroom WHERE classroom_id = $1 AND timetable_id = $2`,
          [classroom_id, timetable_id]
        );
        if (roomRes.rowCount === 0) {
          await client.query(
            `INSERT INTO classroom (classroom_id, name, short, timetable_id)
             VALUES ($1, $1, $1, $2)`,
            [classroom_id, timetable_id]
          );
        }

        // ➤ Period
        const [start, end] = periodText.split(' to ').map(p => p.trim());
        let periodRes = await client.query(
          `SELECT periods_id FROM periods WHERE start_time = $1 AND end_time = $2 AND timetable_id = $3`,
          [start, end, timetable_id]
        );
        let periods_id = periodRes.rows[0]?.periods_id;
        if (!periods_id) {
          periods_id = generateId();
          await client.query(
            `INSERT INTO periods (periods_id, name, short, period, start_time, end_time, timetable_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [periods_id, `Period ${j}`, `P${j}`, j, start, end, timetable_id]
          );
        }

        // ➤ Lesson
        const lessonCheck = await client.query(
          `SELECT lesson_id FROM lesson WHERE timetable_id = $1 AND subject_id = $2 AND $3 = ANY(class_ids) AND $4 = ANY(group_ids)`,
          [timetable_id, subjectId, class_id, batch_id]
        );
        let lesson_id;
        if (lessonCheck.rowCount > 0) {
          lesson_id = lessonCheck.rows[0].lesson_id;
        } else {
          lesson_id = generateId();
          await client.query(
            `INSERT INTO lesson (lesson_id, timetable_id, class_ids, subject_id, periods_per_card, period_per_week, lesson_type, classroom_ids, group_ids)
             VALUES ($1, $2, $3, $4, 1, 2, $5, $6, $7)`,
            [lesson_id, timetable_id, [class_id], subjectId, lessonType, [classroom_id], [batch_id]]
          );
        }

        // ➤ Card
        const cardCheck = await client.query(
          `SELECT card_id FROM card WHERE lesson_id = $1 AND period = $2 AND days = $3 AND timetable_id = $4`,
          [lesson_id, j, day, timetable_id]
        );
        if (cardCheck.rowCount === 0) {
          const card_id = generateId();
          await client.query(
            `INSERT INTO card (card_id, lesson_id, period, weeks, days, timetable_id, classroom_ids)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [card_id, lesson_id, j, 1, day, timetable_id, [classroom_id]]
          );
        }
      }
    }

    console.log('✅ Teacher timetable uploaded successfully.');
  } catch (err) {
    console.error('❌ Error uploading teacher timetable:', err.message);
  } finally {
    client.release();
  }
}

async function uploadClassTimeTable(data, academic_year_id, semester_year_id, academic_calendar_id, class_short, dept_id, institute_id) {
  const client = await pool.connect();
  try {
    const header = data[0];

    // Get or create class
    let classRes = await client.query(
      `SELECT class_id FROM class WHERE short = $1 AND department_id = $2`,
      [class_short, dept_id]
    );
    let class_id = classRes.rows[0]?.class_id;
    if (!class_id) {
      class_id = generateId();
      await client.query(
        `INSERT INTO class (class_id, name, short, department_id, institute_id, timetable_id)
         VALUES ($1, $2, $3, $4, $5, NULL)`,
        [class_id, class_short, class_short, dept_id, institute_id]
      );
    }

    // Get or create timetable
    let timetableRes = await client.query(
      `SELECT id FROM timetable WHERE academic_calendar_id = $1 AND department_id = $2`,
      [academic_calendar_id, dept_id]
    );
    let timetable_id = timetableRes.rows[0]?.id;
    if (!timetable_id) {
      timetable_id = generateId();
      await client.query(
        `INSERT INTO timetable (id, academic_calendar_id, department_id)
         VALUES ($1, $2, $3)`,
        [timetable_id, academic_calendar_id, dept_id]
      );
    }

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const day = row[0];

      for (let j = 1; j < header.length; j++) {
        const periodText = header[j];
        const entry = row[j];

        if (!entry || entry.trim() === 'Break' || entry.trim() === 'No Teaching Load') continue;

        const lines = entry.split(/\r?\n/);
        const [subjectLine, classLine, facultyShort, roomLine, typeLine] = lines;

        const subjectId = subjectLine.split('(')[0].trim();
        const subjectName = subjectLine.split('(')[1]?.replace(')', '').trim() || subjectId;

        const batchShort = classLine.split('(')[1]?.replace(')', '').trim() || class_short;
        const lessonType = typeLine === '2' ? 'Lab' : 'Lecture';

        // ➤ Subject
        let subjectRes = await client.query(
          `SELECT subject_id FROM subject WHERE subject_id = $1 AND timetable_id = $2`,
          [subjectId, timetable_id]
        );
        if (subjectRes.rowCount === 0) {
          await client.query(
            `INSERT INTO subject (subject_id, name, short, timetable_id)
             VALUES ($1, $2, $3, $4)`,
            [subjectId, subjectName, subjectId, timetable_id]
          );
        }

        // ➤ Batch
        let batchRes = await client.query(
          `SELECT batch_id FROM batch WHERE short = $1 AND class_id = $2`,
          [batchShort, class_id]
        );
        let batch_id = batchRes.rows[0]?.batch_id;
        if (!batch_id) {
          batch_id = generateId();
          await client.query(
            `INSERT INTO batch (batch_id, name, short, class_id)
             VALUES ($1, $2, $3, $4)`,
            [batch_id, batchShort, batchShort, class_id]
          );
        }

        // ➤ Classroom
        let classroom_id = roomLine.trim();
        let roomRes = await client.query(
          `SELECT classroom_id FROM classroom WHERE classroom_id = $1 AND timetable_id = $2`,
          [classroom_id, timetable_id]
        );
        if (roomRes.rowCount === 0) {
          await client.query(
            `INSERT INTO classroom (classroom_id, name, short, timetable_id)
             VALUES ($1, $1, $1, $2)`,
            [classroom_id, timetable_id]
          );
        }

        // ➤ Period
        const [start, end] = periodText.split(' to ').map(s => s.trim());
        let periodRes = await client.query(
          `SELECT periods_id FROM periods WHERE start_time = $1 AND end_time = $2 AND timetable_id = $3`,
          [start, end, timetable_id]
        );
        let periods_id = periodRes.rows[0]?.periods_id;
        if (!periods_id) {
          periods_id = generateId();
          await client.query(
            `INSERT INTO periods (periods_id, name, short, period, start_time, end_time, timetable_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [periods_id, `Period ${j}`, `P${j}`, j, start, end, timetable_id]
          );
        }

        // ➤ Lesson
        const lessonCheck = await client.query(
          `SELECT lesson_id FROM lesson WHERE timetable_id = $1 AND subject_id = $2 AND $3 = ANY(class_ids) AND $4 = ANY(group_ids)`,
          [timetable_id, subjectId, class_id, batch_id]
        );
        let lesson_id;
        if (lessonCheck.rowCount > 0) {
          lesson_id = lessonCheck.rows[0].lesson_id;
        } else {
          lesson_id = generateId();
          await client.query(
            `INSERT INTO lesson (lesson_id, timetable_id, class_ids, subject_id, periods_per_card, period_per_week, lesson_type, classroom_ids, group_ids)
             VALUES ($1, $2, $3, $4, 1, 2, $5, $6, $7)`,
            [lesson_id, timetable_id, [class_id], subjectId, lessonType, [classroom_id], [batch_id]]
          );
        }

        // ➤ Card
        const cardCheck = await client.query(
          `SELECT card_id FROM card WHERE lesson_id = $1 AND period = $2 AND days = $3 AND timetable_id = $4`,
          [lesson_id, j, day, timetable_id]
        );
        if (cardCheck.rowCount === 0) {
          const card_id = generateId();
          await client.query(
            `INSERT INTO card (card_id, lesson_id, period, weeks, days, timetable_id, classroom_ids)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [card_id, lesson_id, j, 1, day, timetable_id, [classroom_id]]
          );
        }
      }
    }

    console.log('✅ Class timetable uploaded successfully.');
  } catch (err) {
    console.error('❌ Error uploading class timetable:', err.message);
  } finally {
    client.release();
  }
}

module.exports = {
    uploadToUserInfo,
    uploadStudentData,
    uploadTeacherTimeTable,
    uploadClassTimeTable
};
