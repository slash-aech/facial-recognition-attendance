const express = require('express');
const router = express.Router();
const db = require('../config/dbconfig');

router.post('/mark', async (req, res) => {
  const { user_id, classroom_id, period, latitude, longitude } = req.body;

  if (!user_id || !classroom_id || period == null || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'Missing required fields: user_id, classroom_id, period, latitude, or longitude' });
  }

  try {
    console.log(`📌 Student ${user_id} attempting to mark attendance in classroom ${classroom_id}, period ${period}`);
    var date = new Date();
    // 1️⃣ Get active session for that classroom and period today
    const sessionRes = await db.query(
      `SELECT session_id
       FROM session
       WHERE classroom_id = $1 AND period = $2 AND is_active = true
         AND start_time::date = $3`,
      [classroom_id, period, date]
    );
    console.log(`🔍 Found ${sessionRes.rows[0]} -  active session(s) for classroom ${classroom_id}, period ${period}`)  ;

    if (sessionRes.rowCount === 0) {
      return res.status(403).json({ error: 'No active session found for this classroom and period today' });
    }

    const session_id = sessionRes.rows[0].session_id;

    // 2️⃣ Get geofence data from classroom table
    const roomRes = await db.query(
      `SELECT latitude, longitude, radius
       FROM classroom
       WHERE classroom_id = $1`,
      [classroom_id]
    );

    if (roomRes.rowCount === 0) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    const { latitude: roomLat, longitude: roomLng, radius } = roomRes.rows[0];

    if (roomLat == null || roomLng == null || radius == null) {
      return res.status(500).json({ error: 'Classroom missing geolocation or radius setup' });
    }

    // 3️⃣ Check if already marked
    const alreadyMarked = await db.query(
      `SELECT 1 FROM attendance_log_2025
       WHERE student_id = $1 AND session_id = $2`,
      [user_id, session_id]
    );

    if (alreadyMarked.rowCount > 0) {
      return res.status(409).json({ error: 'Attendance already marked for this session' });
    }

    // 4️⃣ Calculate distance
    const toRad = deg => (deg * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(latitude - roomLat);
    const dLon = toRad(longitude - roomLng);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(roomLat)) * Math.cos(toRad(latitude)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const auto_status = distance <= radius ? 'present' : 'absent';

    // 5️⃣ Insert log
    await db.query(
      `INSERT INTO attendance_log_2025 (
        session_id, student_id, student_latitude, student_longitude,
        distance_meters, auto_status, final_status, marked_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $6, NOW()
      )`,
      [session_id, user_id, latitude, longitude, distance, auto_status]
    );
    

    res.json({
      message: `Attendance ${auto_status === 'present' ? 'marked successfully' : 'outside allowed range'}`,
      status: auto_status,
      distance: Math.round(distance) + ' meters',
    });

  } catch (err) {
    console.error('❌ Error marking attendance:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
