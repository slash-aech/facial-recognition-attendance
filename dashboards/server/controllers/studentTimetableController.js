const pool = require('../config/dbconfig');

const getStudentTimetable = async (req, res) => {
  console.log('🔍 Fetching student timetable...', req.params);
  const { user_id, selectedDate } = req.query;

  if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid user_id in query' });
  }

  if (!selectedDate) {
    return res.status(400).json({ error: 'Missing selectedDate in query' });
  }

  try {
    const enrollmentCheck = await pool.query(
      `SELECT * FROM student_enrollment_information WHERE user_id = $1`,
      [user_id]
    );

    if (enrollmentCheck.rowCount === 0) {
      console.warn(`⚠️ No enrollment found for user_id = ${user_id}`);
      return res.status(404).json({ error: 'Student not enrolled in any class' });
    }

    // Step 1: Get all lessons relevant to the student
    const lessonQuery = `
      SELECT
        l.lesson_id,
        s.name AS subject,
        p.start_time,
        p.end_time,
        c.days,
        c.period,
        c.classroom_ids[1] AS classroom_id,
        cr.short AS classroom_short,
        cls.name AS class_name,
        g.name AS group_name
      FROM student_enrollment_information sei
      JOIN "group" g ON (
        g.group_id = sei.group_id
        OR (g.class_id = sei.class_id AND g.entire_class = true)
      )
      JOIN lesson l ON g.group_id = ANY(l.group_ids)
      JOIN subject s ON l.subject_id = s.subject_id
      JOIN card c ON c.lesson_id = l.lesson_id
      JOIN periods p ON p.period = c.period
      LEFT JOIN class cls ON sei.class_id = cls.class_id
      LEFT JOIN classroom cr ON cr.classroom_id = c.classroom_ids[1]
      WHERE sei.user_id = $1
    `;

    const lessonResult = await pool.query(lessonQuery, [user_id]);

    if (lessonResult.rowCount === 0) {
      return res.json([]);
    }

    const daysMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Step 2: Get all sessions for this student on selected date
    const sessionsQuery = `
      SELECT sess.session_id, sess.lesson_id
      FROM session sess
      JOIN attendance_log_2025 log ON log.session_id = sess.session_id
      WHERE log.student_id = $1
        AND sess.start_time::date = $2
    `;

    const sessionsResult = await pool.query(sessionsQuery, [user_id, selectedDate]);
    const attendedLessons = new Set(sessionsResult.rows.map(row => row.lesson_id));

    // Step 3: Construct structured timetable
    const structured = lessonResult.rows.flatMap(row => {
      if (!row.days) return [];

      const binaryDays = row.days.padStart(6, '0');

      return binaryDays.split('').map((bit, i) =>
        bit === '1'
          ? {
              subject: row.subject,
              startTime: row.start_time,
              endTime: row.end_time,
              day: daysMap[i],
              period: row.period,
              classroom: row.classroom_short || '',
              classroom_id: row.classroom_id || '',
              class: row.class_name || '',
              group: row.group_name || '',
              attended: attendedLessons.has(row.lesson_id),
            }
          : null
      ).filter(Boolean);
    });

    console.log(`📦 Timetable entries returned: ${structured.length}`);
    res.json(structured);
  } catch (err) {
    console.error('❌ Error fetching student timetable:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStudentTimetable };
