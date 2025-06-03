// backend/server.js
const express      = require('express');
const mongoose     = require('mongoose');
const cookieParser = require('cookie-parser');
const cors         = require('cors');
const dotenv       = require('dotenv');

dotenv.config();
const app = express();

// JSON parsing & cookies
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(
  process.env.MONGOURI
);

// CORS: allow Vite frontend on port 5173
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Mount auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));