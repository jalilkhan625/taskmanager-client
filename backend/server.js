const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import route handlers
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const profileRoutes = require('./routes/profiles');
const userRoutes = require('./routes/users');
const followRoutes = require('./routes/follows'); // ✅ Correct filename: 'follow' not 'follows'

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', authRoutes);                  // Authentication routes
app.use('/api/tasks', taskRoutes);            // Task-related routes
app.use('/api/profile', profileRoutes);       // Profile-related routes
app.use('/api/users', userRoutes);            // User search routes
app.use('/api/follow', followRoutes);         // ✅ Follow/Unfollow routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => {
    console.log('🚀 Server running on http://localhost:5000');
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});
