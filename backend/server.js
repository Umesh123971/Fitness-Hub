const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// ✅ CORS Configuration (improved for local dev + explicit preflight handling)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    // Allow any localhost/127.0.0.1 during development (any port)
    const devLocalhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
    if (process.env.NODE_ENV !== 'production' && devLocalhostPattern.test(origin)) {
      return callback(null, true);
    }

    // Production: Allow specific origins (including FRONTEND_URL)
    const allowedOrigins = [
      'https://fitness-hub-1.onrender.com',
      'https://21c-fitness-hub.onrender.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked origin: ${origin}`);
    // Fail the preflight so you can see the origin in browser console
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());

// Ensure preflight OPTIONS requests get CORS headers immediately
app.options('*', cors(corsOptions));

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
const startServer = (startPort, maxAttempts = 5) => {
  let attempts = 0;
  const tryPort = (port) => {
    attempts++;
    // assign to outer-scope server so shutdown handlers can use it
    server = app.listen(port, '0.0.0.0', () => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`✅ Server running on port ${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔓 CORS: Production mode`);
      console.log(`📊 Database: MongoDB Atlas`);
      console.log(`🚀 Ready to accept connections`);
      console.log(`${'='.repeat(50)}\n`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`);
        if (attempts < maxAttempts) {
          const next = port + 1;
          console.log(`➡️ Trying port ${next} (${attempts}/${maxAttempts})...`);
          setTimeout(() => tryPort(next), 300);
        } else {
          console.error('❌ No available ports found after retries. Exiting.');
          process.exit(1);
        }
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
  };

  tryPort(startPort);
};

const PORT = parseInt(process.env.PORT || '5000', 10);
let server = null;
startServer(PORT);

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log('⚠️ SIGINT received, shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});