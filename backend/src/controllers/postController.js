const postService = require("../services/postService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");

exports.createPost = asyncHandler(async (req, res) => {
  const result = await postService.createPost(req.auth.user, req.body);
  return sendSuccess(res, "Post created successfully.", result, 201);
});

exports.listPosts = asyncHandler(async (req, res) => {
  const result = await postService.listPosts(req.auth.user, req.query);
  return sendSuccess(res, "Posts fetched successfully.", result);
});

exports.getPost = asyncHandler(async (req, res) => {
  const result = await postService.getPostById(req.params.id, req.auth.user);
  return sendSuccess(res, "Post fetched successfully.", result);
});

exports.updatePost = asyncHandler(async (req, res) => {
  const result = await postService.updatePost(req.params.id, req.auth.user, req.body);
  return sendSuccess(res, "Post updated successfully.", result);
});

exports.deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id);
  return sendSuccess(res, "Post deleted successfully.");
});

exports.archivePost = asyncHandler(async (req, res) => {
  const result = await postService.archivePost(req.params.id);
  return sendSuccess(res, "Post archived successfully.", result);
});

exports.listDrafts = asyncHandler(async (req, res) => {
  const result = await postService.listDrafts(req.auth.user);
  return sendSuccess(res, "Draft posts fetched successfully.", result);
});

