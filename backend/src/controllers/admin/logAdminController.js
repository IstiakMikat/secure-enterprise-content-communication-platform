const logAdminService = require("../../services/admin/logAdminService");
const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess } = require("../../utils/response");

exports.audit = asyncHandler(async (_req, res) => {
  const result = await logAdminService.audit();
  return sendSuccess(res, "Audit logs fetched successfully.", result);
});

exports.integrityAlerts = asyncHandler(async (_req, res) => {
  const result = await logAdminService.integrityAlerts();
  return sendSuccess(res, "Integrity alerts fetched successfully.", result);
});

exports.securitySummary = asyncHandler(async (_req, res) => {
  const result = await logAdminService.securitySummary();
  return sendSuccess(res, "Security summary fetched successfully.", result);
});

