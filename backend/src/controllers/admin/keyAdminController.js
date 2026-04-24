const keyAdminService = require("../../services/admin/keyAdminService");
const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess } = require("../../utils/response");

exports.listKeys = asyncHandler(async (_req, res) => {
  const result = await keyAdminService.list();
  return sendSuccess(res, "Keys fetched successfully.", result);
});

exports.generateKey = asyncHandler(async (req, res) => {
  const result = await keyAdminService.generate(req.body);
  return sendSuccess(res, "Key generated successfully.", result, 201);
});

exports.rotateKey = asyncHandler(async (req, res) => {
  const result = await keyAdminService.rotate(
    req.params.id,
    req.auth.user.id,
    req.body.reason
  );
  return sendSuccess(res, "Key rotated successfully.", result);
});

exports.revokeKey = asyncHandler(async (req, res) => {
  const result = await keyAdminService.revoke(req.params.id);
  return sendSuccess(res, "Key revoked successfully.", result);
});

