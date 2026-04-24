const biometricService = require("../services/biometricService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");

exports.enroll = asyncHandler(async (req, res) => {
  const result = await biometricService.enroll(
    req.auth.user.id,
    req.body,
    req.requestContext
  );
  return sendSuccess(res, "Biometric enrollment completed.", result);
});

exports.verify = asyncHandler(async (req, res) => {
  const result = await biometricService.verify(
    req.auth.user.id,
    req.body,
    req.requestContext
  );
  return sendSuccess(res, "Biometric verification completed.", result);
});

exports.logs = asyncHandler(async (_req, res) => {
  const result = await biometricService.logs();
  return sendSuccess(res, "Biometric logs fetched successfully.", result);
});

