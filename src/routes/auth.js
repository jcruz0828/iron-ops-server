const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { signup, login, getProfile, addFitnessData } = require('../controllers/authController');

const router = express.Router();

// Validation middleware
const validateSignup = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/profile', auth, getProfile);
router.patch('/fitness-data', auth, addFitnessData);

module.exports = router; 