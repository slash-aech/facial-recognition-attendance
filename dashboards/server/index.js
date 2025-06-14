require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classrooms');
const attendanceRoutes = require('./routes/attendance');
const timetableRoutes = require('./routes/timetable');
const studentUploadRoutes = require('./routes/student');
const facultyUploadRoutes = require('./routes/faculty');

app.use('/api/auth', authRoutes);       // login, register, /check, logout
app.use('/api/classrooms', classroomRoutes);  // GET /api/classrooms  
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/student', studentUploadRoutes);
app.use('/api/faculty', facultyUploadRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});