// backend/controllers/adminController.js
const User = require('../models/User');

// --- Get All Users (Admin Only) ---
const getAllUsers = async (req, res) => {
  try {
    // Find all users, exclude admins maybe, or just fetch all and filter on frontend if needed
    const users = await User.find({ role: 'user' }).select('-password'); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching users', error: error.message });
  }
};

// --- Get Single User Details (Admin Only) ---
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching user', error: error.message });
  }
};

// --- Update User Status (Accept/Reject) (Admin Only) ---
const updateUserStatus = async (req, res) => {
  const { status } = req.body; // Should be 'accepted' or 'rejected'

  if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (user) {
        if(user.role === 'admin'){
             return res.status(400).json({ message: 'Cannot change admin status.' });
        }
      user.status = status;
      const updatedUser = await user.save();
      res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          status: updatedUser.status,
          message: `User ${status}`
       });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating status', error: error.message });
  }
};

// --- Delete User (Admin Only) ---
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
         if(user.role === 'admin'){
             return res.status(400).json({ message: 'Cannot delete admin user.' });
        }
      await user.deleteOne(); // Mongoose v6+ uses deleteOne()
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting user', error: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUserStatus, deleteUser };