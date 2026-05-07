const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");
const env = require("../config/env");

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.nodeEnv === "production",
  maxAge: env.sessionTokenTtlHours * 60 * 60 * 1000,
};

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
  res.cookie("sep_token", result.token, authCookieOptions);
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
  res.clearCookie("sep_token", authCookieOptions);
  return sendSuccess(res, "Logged out successfully.", result);
});

exports.logoutAll = asyncHandler(async (req, res) => {
  const result = await authService.logoutAll(req.auth.user.id);
  res.clearCookie("sep_token", authCookieOptions);
  return sendSuccess(res, "All sessions revoked.", result);
});

exports.me = asyncHandler(async (req, res) => {
  const result = await authService.me(req.auth.user);
  return sendSuccess(res, "Authenticated user profile fetched.", result);
});

exports.googleCallback = asyncHandler(async (req, res) => {
  const result = await authService.googleLogin(req.user, req.requestContext);
  const searchParams = new URLSearchParams({
    userId: String(result.userId),
    purpose: result.purpose,
    channel: result.otpDelivery?.channel || "email",
    destination: result.otpDelivery?.destination || "",
    providerStatus: result.otpDelivery?.providerStatus || "queued",
    previewCode: result.otpDelivery?.previewCode || "",
    expiresAt: result.otpMeta?.expiresAt
      ? new Date(result.otpMeta.expiresAt).toISOString()
      : "",
    resendAvailableAt: result.otpMeta?.resendAvailableAt
      ? new Date(result.otpMeta.resendAvailableAt).toISOString()
      : "",
  });
  res.redirect(`${env.clientUrl}/auth/callback?${searchParams.toString()}`);
});
