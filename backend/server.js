const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// <-- add parsers here so req.body is available for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    // Allow localhost during development
    if (process.env.NODE_ENV !== 'production') {
      const devLocalhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
      if (devLocalhostPattern.test(origin)) return callback(null, true);
    }

    // Allow any Render.com subdomain (for deployed apps)
    if (origin && origin.includes('.onrender.com')) {
      return callback(null, true);
    }

    // Check against allowed origins from environment variable
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
    version: '1.0.1',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  })
})

// ---- Serve static files and SPA fallback (production only) ----
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
  
  // Serve static files with proper error handling
  app.use(express.static(frontendDist, {
    maxAge: '1d',
    etag: true
  }))

  // SPA fallback - serve index.html for non-API routes
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) return next()
    
    // Serve index.html for all other routes
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
      if (err) {
        console.error('Error serving index.html:', err)
        res.status(500).send('Error loading application')
      }
    })
  })
}

// ✅ Error handler (MUST be after all routes)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ✅ 404 handler (MUST be last)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// --- Start server and connect to MongoDB ---
const PORT = parseInt(process.env.PORT || '5000', 10);
let server = null;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    console.log('✅ MongoDB Connected Successfully');

    // Then start the server
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
      console.log(`✅ API available at: http://localhost:${PORT}/api`);
      if (process.env.NODE_ENV === 'production') {
        console.log(`✅ Frontend served from: ${path.join(__dirname, '..', 'frontend', 'dist')}`);
      }
    });

    server.on('error', (error) => {
      if (error && error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

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
