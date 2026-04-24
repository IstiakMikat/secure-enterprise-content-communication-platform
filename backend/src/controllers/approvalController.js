const approvalService = require("../services/approvalService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");

exports.getPending = asyncHandler(async (req, res) => {
  const result = await approvalService.getPending(req.auth.user);
  return sendSuccess(res, "Pending approvals fetched successfully.", result);
});

exports.approve = asyncHandler(async (req, res) => {
  const result = await approvalService.approve(
    req.params.id,
    req.auth.user,
    req.body.comment
  );
  return sendSuccess(res, "Post approved successfully.", result);
});

exports.reject = asyncHandler(async (req, res) => {
  const result = await approvalService.reject(
    req.params.id,
    req.auth.user,
    req.body.comment
  );
  return sendSuccess(res, "Post rejected successfully.", result);
});

