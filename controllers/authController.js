// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// --- Helper Function to generate JWT ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// --- Nodemailer Setup (Example using Gmail) ---
// IMPORTANT: For Gmail, you might need to enable "Less secure app access" (not recommended)
// OR generate an "App Password" (recommended).
// Consider using services like SendGrid or Mailgun for production apps.
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to FriendBook!',
    text: `Hey ${name}! \n\nWelcome to my community - FriendBook! Your registration is currently pending approval by the admin.\n\nBest,\n[Your Name/FriendBook Team]` // Customize your message
    // You can also use `html:` for richer emails
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Email sending error:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};


// --- Signup User ---
const signupUser = async (req, res) => {
  const { name, username, branch, address, email, mobile, password } = req.body;

  try {
    // Check if user (email or username) already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Create new user (password hashing happens in the model's pre-save hook)
    // Default status is 'pending'
    const user = await User.create({
      name,
      username,
      branch,
      address,
      email,
      mobile,
      password, // Hashing is handled by Mongoose pre-save middleware
      // role defaults to 'user', status defaults to 'pending'
    });

    if (user) {
      // Send Welcome Email (only after user is successfully created)
      sendWelcomeEmail(user.email, user.name);

      // Respond (don't send token yet, maybe wait for admin approval)
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        message: 'Registration successful! Your account is pending approval.'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error during signup', error: error.message });
  }
};

// --- Login User ---
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    // Check if user exists and password matches (using the method we added to the model)
    // Also check if user status is 'accepted'
    if (user && (await user.comparePassword(password))) {
        if(user.status !== 'accepted') {
            return res.status(401).json({ message: 'Account not yet approved by admin or rejected.' });
        }
      // User is valid and accepted, send back user info and token
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Generate JWT
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' }); // Unauthorized
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error during login', error: error.message });
  }
};

// --- Get User Profile (for logged-in user) ---
const getUserProfile = async (req, res) => {
  // We get req.user from the 'protect' middleware
  try {
    // req.user already contains the user data (excluding password) fetched by ID from the token
    if (req.user) {
         // Ensure user status is still 'accepted'
         if (req.user.status !== 'accepted') {
            return res.status(403).json({ message: 'Your account status has changed. Please contact admin.' });
        }
      res.json({
        _id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        branch: req.user.branch,
        address: req.user.address,
        email: req.user.email,
        mobile: req.user.mobile,
        status: req.user.status,
        role: req.user.role,
        createdAt: req.user.createdAt
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
     res.status(500).json({ message: 'Server Error fetching profile', error: error.message });
  }
};


module.exports = { signupUser, loginUser, getUserProfile };