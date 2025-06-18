const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  // origin: 'https://facial-recognition-attendance-3wlw.onrender.com',
  origin:'http://localhost:5173',
  credentials: true
}));


const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classrooms');
const attendanceRoutes = require('./routes/attendance');
const timetableRoutes = require('./routes/timetable');
const studentUploadRoutes = require('./routes/student');
const facultyUploadRoutes = require('./routes/faculty');
const faceRouter = require('./routes/faceRouter')
const protectedRoute = require('./routes/protectedRoutes');
const userRouters = require('./routes/userRouters');
const superAdminRoutes = require('./routes/superAdminRoutes');

app.use('/api/auth', authRoutes);       // login, register, /check, logout
app.use('/api/classrooms', classroomRoutes);  // GET /api/classrooms  
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/student', studentUploadRoutes);
app.use('/api/faculty', facultyUploadRoutes);
app.use('/api', userRouters);
app.use('/api/face', faceRouter);
app.use('/api/api', protectedRoute);
app.use('/api/superAdmin', superAdminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});