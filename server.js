// backend/server.js (add near the top)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middleware (keep these)
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : ['http://friendbook-dx9o.onrender.com', 'http://127.0.0.1:5173'];

if (process.env.NODE_ENV === 'production') {
    console.log('FRONTEND_URL (Production):', process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes); // Mount auth routes at /api/auth
app.use('/api/users', userRoutes); // Mount user routes at /api/users
app.use('/api/admin', adminRoutes); // Mount admin routes at /api/admin

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));
// --- End MongoDB Connection ---

// Simple Route (keep for now)
app.get('/', (req, res) => {
  res.send('Hello from FriendBook Backend!');
});

app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Example: General error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        // Stack trace is helpful in development, but hide in production
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
