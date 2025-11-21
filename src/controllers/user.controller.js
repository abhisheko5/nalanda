const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
  res.status(200).json({
    success: true,
    data: result
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({
    success: true,
    data: { user }
  });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user }
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.status(200).json({
    success: true,
    ...result
  });
});