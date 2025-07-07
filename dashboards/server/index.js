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
  // origin: 'https://facial-recognition-attendance-3wlw.onrender.com',
  origin: 'http://localhost:5173', // Change to your frontend URL
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
const classroomRoutes = require('./routes/facultyAttendanceOnOffRoute');
const studentAttendanceRoutes = require('./routes/studentAttendanceRoutes');
const facultyUploadRoutes = require('./routes/facultyUploadXLSX');
const studentUploadRoutes = require('./routes/studentUploadXLSX');
const faceRouter = require('./routes/faceRouter');
const userRouters = require('./routes/userRouters');
const superAdminRoutes = require('./routes/superAdminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const classData = require('./routes/class');
const facultyRoutes = require('./routes/facultyTimetableRoutes');
const studentRoutes = require('./routes/studentTimetableRoutes');
const facultyAttendance = require('./routes/facultyAttendanceRoutes');
const attendanceReportRoutes = require('./routes/attendanceReportRoutes');
const profile = require('./routes/profile');
const hodRoutes = require('./routes/hodRoutes');

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/student-attendance', studentAttendanceRoutes);
app.use('/api/student-data-upload', studentUploadRoutes);
app.use('/api/faculty-data-upload', facultyUploadRoutes);
app.use('/api', userRouters);
app.use('/api/face', faceRouter);
app.use('/api/superAdmin', superAdminRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/class', classData);
app.use('/api/faculty-attendance', facultyAttendance);
app.use('/api/report', attendanceReportRoutes);
app.use('/api/profile', profile);
app.use('/api/hod', hodRoutes);



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
