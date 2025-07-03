const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

app.use(cookieParser());
app.use(cors({
  origin: 'https://facial-recognition-attendance-3wlw.onrender.com',
  credentials: true
}));

// ✅ TEMP variable to store uploaded payload
let lastTimetablePayload = null;

// 👇 This must be BEFORE insertTimetableData is called
// If your /api/timetable/upload is handled inside `timetableRoutes`,
// update the route file like this:
const timetableRoutes = require('./routes/timeTableRoutes')(payload => {
  lastTimetablePayload = payload;
});

const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classrooms');
const attendanceRoutes = require('./routes/attendance');
const facultyUploadRoutes = require('./routes/facultyUploadXLSX');
const studentUploadRoutes = require('./routes/studentUploadXLSX');
const faceRouter = require('./routes/faceRouter');
const protectedRoute = require('./routes/protectedRoutes');
const userRouters = require('./routes/userRouters');
const superAdminRoutes = require('./routes/superAdminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const facultyData = require('./routes/facultyData');
const classData = require('./routes/class');

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/student-data-upload', studentUploadRoutes);
app.use('/api/faculty-data-upload', facultyUploadRoutes);
app.use('/api', userRouters);
app.use('/api/face', faceRouter);
app.use('/api/api', protectedRoute);
app.use('/api/superAdmin', superAdminRoutes);
app.use('/api/timetable', timetableRoutes); // 👈 this should update `lastTimetablePayload`
app.use('/api/upload', uploadRoutes);
app.use('/api/faculty', facultyData);
app.use('/api/class', classData);

// ✅ DEBUG PAGE
app.get('/debug/timetable', (req, res) => {
  if (!lastTimetablePayload) {
    return res.send('<h2>No timetable data uploaded yet.</h2>');
  }

  res.send(`
    <html>
      <head>
        <title>Timetable Debug</title>
        <style>
          body { font-family: monospace; padding: 20px; background: #f9f9f9; }
          pre { white-space: pre-wrap; word-wrap: break-word; background: #eee; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h2>📝 Last Uploaded Timetable Payload</h2>
        <pre>${JSON.stringify(lastTimetablePayload, null, 2)}</pre>
      </body>
    </html>
  `);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
