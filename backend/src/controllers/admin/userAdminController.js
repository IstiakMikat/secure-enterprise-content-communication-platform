const userAdminService = require("../../services/admin/userAdminService");
const asyncHandler = require("../../utils/asyncHandler");
const { sendSuccess } = require("../../utils/response");

exports.listUsers = asyncHandler(async (_req, res) => {
  const result = await userAdminService.listUsers();
  return sendSuccess(res, "Users fetched successfully.", result);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const result = await userAdminService.updateStatus(req.params.id, req.body.accountStatus);
  return sendSuccess(res, "User status updated successfully.", result);
});

exports.updateRole = asyncHandler(async (req, res) => {
  const result = await userAdminService.updateRole(req.params.id, req.body.roleId);
  return sendSuccess(res, "User role updated successfully.", result);
});

exports.updateDepartment = asyncHandler(async (req, res) => {
  const result = await userAdminService.updateDepartment(
    req.params.id,
    req.body.departmentId
  );
  return sendSuccess(res, "User department updated successfully.", result);
});

