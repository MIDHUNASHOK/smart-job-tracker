




const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');
const profileRoutes = require('./routes/profile.routes');
const skillRoutes = require('./routes/skill.routes');
const experienceRoutes =require('./routes/experience.routes');
const educationRoutes =require('./routes/education.routes');
const certificationRoutes =require('./routes/certification.routes');
const languageRoutes =require('./routes/language.routes');

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Job Tracker API Running 🚀'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/profile/experiences',experienceRoutes);
app.use('/api/profile/skills', skillRoutes);
app.use('/api/profile/educations',educationRoutes);
app.use('/api/profile/certifications',certificationRoutes);
app.use('/api/profile/languages',languageRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;