const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');

// Utility to check user role
async function isAuthorizedFaculty(userId) {
  const result = await db.query(
    `SELECT user_role FROM user_info WHERE user_id = $1`,
    [userId]
  );

  if (result.rowCount === 0) return false;

  const role = result.rows[0].user_role;
  return ['teacher', 'hod', 'admin', 'superadmin'].includes(role.toLowerCase());
}

// ✅ START attendance for a classroom
router.patch('/:id/start', async (req, res) => {
  console.log("✅ Start attendance request received");
  const { id } = req.params;
  const { latitude, longitude, radius, userId, period, lesson_id } = req.body;

  if (
    !id || !userId || !lesson_id ||
    latitude == null || longitude == null || radius == null || period == null
  ) {
    console.error('❌ Missing required parameters:', {
      id, userId, lesson_id, latitude, longitude, radius, period
    });
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    await db.query('BEGIN');

    // 🔍 Step 1: Try to find an existing session for today
    const sessionRes = await db.query(
      `SELECT session_id FROM session
       WHERE classroom_id = $1
         AND period = $2
         AND lesson_id = $3
         AND start_time::date = (NOW() AT TIME ZONE 'Asia/Kolkata')::date
       ORDER BY start_time DESC
       LIMIT 1`,
      [id, period, lesson_id]
    );

    if (sessionRes.rowCount > 0) {
      const existingSessionId = sessionRes.rows[0].session_id;

      // ✅ Reactivate the existing session
      await db.query(
        `UPDATE session SET is_active = true WHERE session_id = $1`,
        [existingSessionId]
      );

      console.log(`🔁 Reactivated existing session: ${existingSessionId}`);
    } else {
      // 🆕 No session today → create a new one
      await db.query(
        `INSERT INTO session (
           session_id, classroom_id, teacher_id, period, is_active, start_time, lesson_id
         ) VALUES (
           gen_random_uuid(), $1, $2, $3, true, NOW(), $4
         )`,
        [id, userId, period, lesson_id]
      );

      console.log('🆕 Inserted new session for today.');
    }

    // ✅ Update classroom location/radius
    await db.query(
      `UPDATE classroom
       SET latitude = $1, longitude = $2, radius = $3
       WHERE classroom_id = $4`,
      [latitude, longitude, radius, id]
    );

    await db.query('COMMIT');
    res.json({ message: `Attendance started for classroom ${id} (period ${period})` });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('❌ Error starting attendance:', err.message);
    res.status(500).json({ error: 'Failed to start attendance' });
  }
});



// POST /api/attendance/manual
// POST /classrooms/manual/:teacher_id
// POST /classrooms/manual/:teacher_id
router.post("/manual/:teacher_id", async (req, res) => {

  const { teacher_id } = req.params;
  const { student_id, classroom_id, period } = req.body;
  console.log(req.body);

  if (!student_id || !classroom_id || !teacher_id|| period == null) {
    console.error(`❌ Missing student_id${student_id}, classroom_id${classroom_id}, teacher_id${teacher_id} or period${period}`);
    return res.status(400).json({ error: "Missing student_id, classroom_id, or period" });
  }

  const now = new Date();
  const year = now.getFullYear();
  const tableName = `attendance_log_${year}`;
  try {
    // ✅ Find latest active session today for that teacher/classroom/period
    const sessionRes = await db.query(
  `SELECT session_id FROM session
   WHERE classroom_id = $1
     AND teacher_id = $2
     AND period = $3
     AND start_time::date = (NOW() AT TIME ZONE 'Asia/Kolkata')::date
   ORDER BY start_time DESC
   LIMIT 1`,
  [classroom_id, teacher_id, period]
);

    if (sessionRes.rowCount === 0) {
      console.error(`❌ No session found for classroom ${classroom_id}, teacher ${teacher_id}, period ${period} today`);
      return res.status(404).json({ error: "No session found for this classroom/teacher/period today" });
    }

    const session_id = sessionRes.rows[0].session_id;

    // ✅ Check if attendance already exists
    const existing = await db.query(
      `SELECT 1 FROM ${tableName}
       WHERE student_id = $1 AND session_id = $2`,
      [student_id, session_id]
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "Attendance already exists for this student/session" });
    }

    // ✅ Insert excused attendance
    await db.query(
      `INSERT INTO ${tableName} (
         session_id, student_id, auto_status, final_status, marked_at
       ) VALUES (
         $1, $2, 'excused', 'present', NOW()
       )`,
      [session_id, student_id]
    );

    res.json({ success: true, message: "Student manually marked as excused" });
  } catch (err) {
    console.error("❌ Manual attendance error:", err);
    res.status(500).json({ error: "Failed to mark excused attendance" });
  }
});





// ✅ STOP attendance for a classroom
router.patch('/:id/stop', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!id || !user_id) {
    console.error('❌ Missing classroom ID or user ID');
    return res.status(400).json({ error: 'Missing classroom ID or user ID' });
  }

  try {
    const authorized = await isAuthorizedFaculty(user_id);
    if (!authorized) {
      return res.status(403).json({ error: 'Unauthorized: Only teachers or higher can stop attendance' });
    }
    // console.log(`✅ User ${user_id} is authorized to stop attendance`);
    await db.query(`
  UPDATE session
  SET is_active = false, end_time = NOW()
  WHERE classroom_id = $1
    AND is_active = true
    AND start_time::date = (NOW() AT TIME ZONE 'Asia/Kolkata')::date
`, [id]);



    res.json({ message: `✅ Attendance stopped for classroom ${id}` });
  } catch (err) {
    console.error('❌ Error stopping attendance:', err.message);
    res.status(500).json({ error: 'Failed to stop attendance' });
  }
});

module.exports = router;
