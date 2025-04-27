const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // To hash passwords

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving user to database
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password
  }
  next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password); // Compare entered password with hashed password
};

const User = mongoose.model('User', userSchema);

module.exports = User;