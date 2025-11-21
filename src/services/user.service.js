const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');

class UserService {
  async getAllUsers(query) {
    const { page = 1, limit = 10, role, search } = query;
    const filter = {};
    
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    return {
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return { message: 'User deactivated successfully' };
  }
}

module.exports = new UserService();