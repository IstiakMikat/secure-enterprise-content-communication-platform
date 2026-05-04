const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body, req.requestContext);
  return sendSuccess(res, "Registration completed. OTP verification required.", result, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, req.requestContext);
  return sendSuccess(res, "Primary login successful. OTP sent.", result);
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyOtp(req.body, req.requestContext);
  return sendSuccess(res, "OTP verification successful.", result);
});

exports.resendOtp = asyncHandler(async (req, res) => {
  const result = await authService.resendOtp(req.body);
  return sendSuccess(res, "OTP re-issued successfully.", result);
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  return sendSuccess(res, "Password reset flow initiated.", result);
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  return sendSuccess(res, "Password reset successful.", result);
});

exports.logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.auth.token);
  return sendSuccess(res, "Logged out successfully.", result);
});

exports.logoutAll = asyncHandler(async (req, res) => {
  const result = await authService.logoutAll(req.auth.user.id);
  return sendSuccess(res, "All sessions revoked.", result);
});

exports.me = asyncHandler(async (req, res) => {
  const result = await authService.me(req.auth.user);
  return sendSuccess(res, "Authenticated user profile fetched.", result);
});

exports.googleCallback = asyncHandler(async (req, res) => {
  const result = await authService.googleLogin(req.user, req.requestContext);
  // Redirect to frontend with token or handle as needed
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${result.token}`);
});
