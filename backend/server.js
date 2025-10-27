const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// ✅ CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    // Allow localhost during development
    if (process.env.NODE_ENV !== 'production') {
      const devLocalhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
      if (devLocalhostPattern.test(origin)) return callback(null, true);
    }

    // Production: allow only deployed frontend (read from FRONTEND_URL)
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://fitness-hub-1.onrender.com',
      'https://21c-fitness-hub.onrender.com',
      'https://fitnesshub-ldtq.onrender.com'
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked origin: ${origin}`);
    // DENY unknown origins (do not silently allow)
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  exposedHeaders: ['Content-Range','X-Content-Range'],
  maxAge: 86400
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ---- Register API routes FIRST (always) ----
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/members', require('./routes/memberRoutes'))
app.use('/api/trainers', require('./routes/trainerRoutes'))
app.use('/api/classes', require('./routes/classRoutes'))
app.use('/api/bookings', require('./routes/bookingRoutes'))
app.use('/api/payments', require('./routes/paymentRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))

// Health endpoint under /api
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to 21C Fitness Hub API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  })
})

// ---- Then static serving / SPA fallback (production only) ----
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
  app.use(express.static(frontendDist))

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    return res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

// ✅ Connect to MongoDB
connectDB()
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');

    // ✅ Error handler
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
      });
    });

    // ✅ 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error);
  });

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// --- Add startServer implementation and start server ---
const PORT = parseInt(process.env.PORT || '5000', 10);
let server = null;

const startServer = (port) => {
  server = app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${port} (env: ${process.env.NODE_ENV || 'development'})`);
  });

  server.on('error', (error) => {
    if (error && error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use`);
    } else {
      console.error('❌ Server error:', error);
    }
    process.exit(1);
  });
};

startServer(PORT);

// ✅ Graceful shutdown
const shutdown = () => {
  console.log('⚠️ Shutdown signal received, closing server...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
