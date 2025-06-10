require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: 'https://onrender.com',
  credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classrooms');
const attendanceRoutes = require('./routes/attendance');
app.use('/api/auth', authRoutes);       // login, register, /me, logout
app.use('/api/classrooms', classroomRoutes);  // GET /api/classrooms  
app.use('/api/attendance', attendanceRoutes);



app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});