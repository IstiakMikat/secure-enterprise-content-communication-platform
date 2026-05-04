const analyticsService = require("../services/analyticsService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");

exports.companyOverview = asyncHandler(async (_req, res) => {
  const result = await analyticsService.getCompanyOverview();
  return sendSuccess(res, "Company overview fetched successfully.", result);
});

exports.myOverview = asyncHandler(async (req, res) => {
  const result = await analyticsService.getMyOverview(req.auth.user);
  return sendSuccess(res, "Workspace overview fetched successfully.", result);
});

exports.employeePerformance = asyncHandler(async (_req, res) => {
  const result = await analyticsService.getEmployeePerformance();
  return sendSuccess(res, "Employee analytics fetched successfully.", result);
});

exports.departmentOverview = asyncHandler(async (_req, res) => {
  const result = await analyticsService.getDepartmentOverview();
  return sendSuccess(res, "Department analytics fetched successfully.", result);
});

exports.securityOverview = asyncHandler(async (_req, res) => {
  const result = await analyticsService.getSecurityOverview();
  return sendSuccess(res, "Security overview fetched successfully.", result);
});
