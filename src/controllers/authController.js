const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup controller
const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      password,
      name
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile controller
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile controller
const addFitnessData = async (req, res) => {
    try {
      const { fitnessData } = req.body;
  
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // ✅ Initialize fitnessData if missing
      if (!user.fitnessData) {
        user.fitnessData = {};
      }
  
      if (fitnessData) {
        if (fitnessData.birthDate) {
          user.fitnessData.birthDate = new Date(fitnessData.birthDate);
        }
  
        if (fitnessData.weight) {
          user.fitnessData.weight = fitnessData.weight.map(w => ({
            value: w.value,
            date: w.date ? new Date(w.date) : new Date(),
          }));
        }
  
        if (fitnessData.sex) {
          user.fitnessData.sex = fitnessData.sex;
        }
  
        if (fitnessData.fitnessGoals) {
          // Optional: Convert comma string to array
          user.fitnessData.fitnessGoals = fitnessData.fitnessGoals
        }
      }
  
      await user.save();
      res.json(user);
    } catch (error) {
      console.error('🔥 Error updating profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  



module.exports = {
  signup,
  login,
  getProfile,
  addFitnessData
}; 