const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const fitnessDataSchema = new mongoose.Schema({
  birthDate: {
    type: Date,
    required: true
  },
  weight: [{
    value: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      default: Date.now,
    }
  }],
  sex: {
    type: String,
    enum: ['M','F'],
    required: true,
  },
  fitnessGoals: [{
    type: String
  }]
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  fitnessData: fitnessDataSchema // Add the fitness data schema here
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to update age based on birth year
userSchema.methods.updateAge = function(birthYear) {
  const currentYear = new Date().getFullYear();
  this.fitnessData.age = currentYear - birthYear;
};

module.exports = mongoose.model('User', userSchema); 