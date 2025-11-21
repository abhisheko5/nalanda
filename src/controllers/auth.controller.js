const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  res.status(200).json({
    success: true,
    data: { user }
  });
});