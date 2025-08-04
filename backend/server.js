require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const treatmentRoutes = require('./src/routes/treatmentRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const adultTeethRoutes = require('./src/routes/adultTeethRoutes');
const childTeethRoutes = require('./src/routes/childTeethRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - matching Django URL patterns
app.use('/', authRoutes); // Auth routes at root level
app.use('/patient', patientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/treatments', treatmentRoutes);
app.use('/payment', paymentRoutes);
app.use('/adultteeth', adultTeethRoutes);
app.use('/childteeth', childTeethRoutes);
app.use('/dashboard', dashboardRoutes);

// Additional routes for compatibility with Django patterns
app.use('/treatmentsid', treatmentRoutes); // Alias for treatments
app.use('/users', authRoutes); // Alias for user routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Clinic API is running' });
});

// API Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Clinic API is running', timestamp: new Date().toISOString() });
});

// Serve static files from React build (if needed)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  // Catch all handler for React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Clinic API server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🏥 API base URL: http://localhost:${PORT}`);
});

module.exports = app;