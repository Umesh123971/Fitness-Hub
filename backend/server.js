const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ PRODUCTION-READY CORS Configuration
const isDevelopment = process.env.NODE_ENV !== 'production';

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // In development: Allow ALL localhost and 127.0.0.1 ports
    if (isDevelopment) {
      if (origin.startsWith('http://localhost:') || 
          origin.startsWith('http://127.0.0.1:') ||
          origin.startsWith('https://localhost:') ||
          origin.startsWith('https://127.0.0.1:')) {
        return callback(null, true);
      }
    }
    
    // In production: Allow specific origins
    const allowedOrigins = [
      'https://fitness-hub-1.onrender.com',  // ✅ Your actual frontend URL
      'https://21c-fitness-hub.onrender.com', // Alternative frontend URL
      process.env.FRONTEND_URL // Dynamic from environment variable
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log(`❌ CORS blocked origin: ${origin}`); // For debugging
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to 21C Fitness Hub API',
    environment: process.env.NODE_ENV || 'development',
    cors: isDevelopment ? 'All localhost ports allowed' : 'Production origins only'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔓 CORS: ${isDevelopment ? 'All localhost ports allowed' : 'Production origins only'}`);
  console.log(`📊 Database: Connected to MongoDB\n`);
});