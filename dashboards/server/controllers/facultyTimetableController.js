const pool = require('../config/dbconfig');

const getFacultyTimetable = async (req, res) => {
  const { user_id, selectedDate } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id in query' });
  }
  try {
// Step 1: Remove EXISTS clause from query
const query = `
  SELECT
    l.lesson_id,
    l.teacher_ids,
    l.class_ids,
    l.group_ids,
    cls.class_name,
    g.group_name,
    s.name AS subject,
    s.subject_id,
    s.short AS short,
    p.start_time,
    p.end_time,
    c.days,
    c.period,
    c.classroom_ids,
    cr.short AS classroom_short
  FROM lesson l
  JOIN teacher_enrollment_info tei ON tei.user_id = ANY(l.teacher_ids)
  JOIN subject s ON l.subject_id = s.subject_id
  JOIN card c ON c.lesson_id = l.lesson_id
  JOIN periods p ON p.period = c.period

  LEFT JOIN LATERAL (
    SELECT name AS class_name
    FROM class
    WHERE class_id = ANY(l.class_ids)
    LIMIT 1
  ) cls ON true

  LEFT JOIN LATERAL (
    SELECT name AS group_name
    FROM "group"
    WHERE group_id = ANY(l.group_ids)
    LIMIT 1
  ) g ON true

  LEFT JOIN classroom cr ON cr.classroom_id = c.classroom_ids[1]

  WHERE tei.user_id = $1
`;

const result = await pool.query(query, [user_id]);

if (result.rowCount === 0) {
  return res.json([]);
}

// Step 2: fetch attended sessions on selectedDate
const sessionRes = await pool.query(
  `SELECT lesson_id, period FROM session WHERE start_time::date = $1 AND teacher_id = $2`,
  [selectedDate, user_id]
);


const attendedSet = new Set(sessionRes.rows.map(r => `${r.lesson_id}-${r.period}`));
console.log('[DEBUG] Attended Set Contents:', Array.from(attendedSet));


// Step 3: map and attach attended info based on selectedDate
const daysMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const selectedDayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });

const structured = result.rows.flatMap(row => {
  const binaryDays = row.days.padStart(6, '0');
  return binaryDays
    .split('')
    .map((bit, i) => {
      if (bit !== '1') return null;

      const dayName = daysMap[i];
      const attended = dayName === selectedDayName &&
                 attendedSet.has(`${row.lesson_id.toString()}-${row.period.toString()}`);
      return {
        subjectId: row.subject_id,
        subject_short: row.short,
        lessonId: row.lesson_id,
        class: row.class_name || '',
        group: row.group_name || '',
        classroom: row.classroom_short || '',
        startTime: row.start_time,
        endTime: row.end_time,
        day: dayName,
        attended,
      };
    })
    .filter(Boolean);
});
res.json(structured);

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getFacultyTimetable };
