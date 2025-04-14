// backend/routes/adminRoutes.js
const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect, admin); // Apply middleware to all routes in this file

router.get('/users', getAllUsers); // GET /api/admin/users
router.get('/users/:id', getUserById); // GET /api/admin/users/some_user_id
router.put('/users/:id/status', updateUserStatus); // PUT /api/admin/users/some_user_id/status (send { status: 'accepted' } in body)
router.delete('/users/:id', deleteUser); // DELETE /api/admin/users/some_user_id

module.exports = router;