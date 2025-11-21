const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

class AuthService {
  async register(userData) {
    const { name, email, password, role } = userData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError('Email already registered', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'member'
    });

    const token = generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new ApiError('Account is deactivated', 401);
    }

    const token = generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }
}

module.exports = new AuthService();