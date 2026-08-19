const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_for_dev', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
      }
    });

    res.status(201).json({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      monthlyBudget: user.monthlyBudget,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @route   PUT /api/auth/budget
// @desc    Update user monthly budget target
// @access  Private
router.put('/budget', protect, async (req, res) => {
  try {
    const { monthlyBudget } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { monthlyBudget: Number(monthlyBudget) }
    });

    res.json({ message: 'Budget updated successfully', monthlyBudget: updatedUser.monthlyBudget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
