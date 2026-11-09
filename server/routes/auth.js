const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

// In-memory fallback if MongoDB connection is pending/offline
let memoryUsers = [
  {
    _id: 'usr_1',
    name: 'Abhimanyu Kotari',
    email: 'abhimanyu@rvu.edu.in',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    bio: 'Lead Developer at DevCollab'
  },
  {
    _id: 'usr_1b',
    name: 'Abhimanyu Kotari',
    email: 'abhimanyukotaribsc24@rvu.edu.in',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    bio: 'Lead Developer at DevCollab'
  },
  {
    _id: 'usr_2',
    name: 'Dhanush V',
    email: 'dhanushvbsc24@rvu.edu.in',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'Backend Developer',
    skills: ['Node.js', 'Express', 'SQL'],
    bio: 'Backend & Systems Engineer'
  },
  {
    _id: 'usr_3',
    name: 'Aniketh',
    email: 'kharviani2@gmail.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'UI/UX Designer',
    skills: ['React', 'CSS', 'Figma'],
    bio: 'Frontend & UI Specialist'
  }
];

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, skills, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if database is connected
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email already exists.'
        });
      }

      // Hash password with bcryptjs
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: role || 'Student Developer',
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
        bio: bio || ''
      });

      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          bio: user.bio
        }
      });
    } else {
      // In-memory fallback
      const exists = memoryUsers.find(u => u.email === cleanEmail);
      if (exists) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email already exists.'
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const newUser = {
        _id: 'usr_' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: role || 'Student Developer',
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
        bio: bio || ''
      };
      memoryUsers.push(newUser);

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Registration successful (in-memory mode)',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          skills: newUser.skills,
          bio: newUser.bio
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both email and password.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. User not found.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. Incorrect password.'
        });
      }

      const resolvedName = (user.name && user.name.toLowerCase() !== cleanEmail.split('@')[0])
        ? user.name
        : (cleanEmail.includes('abhimanyu') ? 'Abhimanyu Kotari' : user.name);

      const token = jwt.sign(
        { id: user._id, email: user.email, name: resolvedName, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: resolvedName,
          email: user.email,
          role: user.role,
          skills: user.skills,
          bio: user.bio
        }
      });
    } else {
      // In-memory fallback
      const user = memoryUsers.find(u => u.email === cleanEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. User not found.'
        });
      }

      const isMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. Incorrect password.'
        });
      }

      const resolvedName = (user.name && user.name.toLowerCase() !== cleanEmail.split('@')[0])
        ? user.name
        : (cleanEmail.includes('abhimanyu') ? 'Abhimanyu Kotari' : user.name);

      const token = jwt.sign(
        { id: user._id, email: user.email, name: resolvedName, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful (in-memory mode)',
        token,
        user: {
          id: user._id,
          name: resolvedName,
          email: user.email,
          role: user.role,
          skills: user.skills,
          bio: user.bio
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET /api/auth/me (Protected route)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, error: 'User profile not found.' });
      }
      return res.status(200).json({ success: true, user });
    } else {
      const user = memoryUsers.find(u => u._id === req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User profile not found.' });
      }
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skills: user.skills,
          bio: user.bio
        }
      });
    }
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
