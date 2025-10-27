const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// ✅ CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Development: Allow all localhost ports
    if (process.env.NODE_ENV !== 'production') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
    }
    
    // Production: Allow specific origins
    const allowedOrigins = [
      'https://fitness-hub-1.onrender.com',
      'https://21c-fitness-hub.onrender.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log(`⚠️ CORS blocked origin: ${origin}`);
    callback(null, true); // Allow in production for debugging
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Health check BEFORE connecting to database
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to 21C Fitness Hub API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// ✅ Connect to MongoDB with error handling
connectDB()
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    
    // Routes - only register after DB connection
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/members', require('./routes/memberRoutes'));
    app.use('/api/trainers', require('./routes/trainerRoutes'));
    app.use('/api/classes', require('./routes/classRoutes'));
    app.use('/api/bookings', require('./routes/bookingRoutes'));
    app.use('/api/payments', require('./routes/paymentRoutes'));
    app.use('/api/dashboard', require('./routes/dashboardRoutes'));
    
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
      });
    });
    
    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
      });
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error);
    // Continue running server even if DB fails (for health checks)
  });

// ✅ Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔓 CORS: Production mode`);
  console.log(`📊 Database: MongoDB Atlas`);
  console.log(`🚀 Ready to accept connections`);
  console.log(`${'='.repeat(50)}\n`);
});

// ✅ Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⚠️ SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});