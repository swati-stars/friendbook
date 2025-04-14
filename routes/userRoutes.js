// backend/routes/userRoutes.js
const express = require('express');
const { getUserProfile } = require('../controllers/authController'); // Profile logic is in authController
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Protect this route - only logged-in users can access
router.get('/profile', protect, getUserProfile);

module.exports = router;