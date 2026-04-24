const userService = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");

exports.getProfile = asyncHandler(async (req, res) => {
  const result = await userService.getProfile(req.auth.user.id);
  return sendSuccess(res, "Profile fetched successfully.", result);
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const result = await userService.updateProfile(
    req.auth.user.id,
    req.body,
    req.auth.user.id
  );
  return sendSuccess(res, "Profile updated successfully.", result);
});

exports.changePassword = asyncHandler(async (req, res) => {
  const result = await userService.changePassword(req.auth.user.id, req.body);
  return sendSuccess(res, "Password changed successfully.", result);
});

exports.getNotifications = asyncHandler(async (req, res) => {
  const result = await userService.getNotifications(req.auth.user.id);
  return sendSuccess(res, "Notifications fetched successfully.", result);
});

exports.markNotificationRead = asyncHandler(async (req, res) => {
  const result = await userService.markNotificationRead(
    req.auth.user.id,
    req.params.id
  );
  return sendSuccess(res, "Notification marked as read.", result);
});

