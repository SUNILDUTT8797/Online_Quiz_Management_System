// server.js
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5500",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));


// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'quiz_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true
  } 
}));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});



// MySQL connection (for now, just a test)
const connectDB = async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    console.log('✅ MySQL Connected');
  } catch (err) {
    console.error('❌ DB Error:', err.message);
  }
};

connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('🎉 Online Quiz Backend Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
