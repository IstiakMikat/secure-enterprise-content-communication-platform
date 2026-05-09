const Post = require("../models/Post");
const PostApproval = require("../models/PostApproval");
const AppError = require("../utils/AppError");

class ApprovalService {
  async getPending(actor) {
    const postService = require("./postService"); // Lazy load to prevent circular dependencies
    const posts = await Post.find({
      status: "PENDING_APPROVAL",
      ...(actor.role === "MANAGER" ? { departmentId: actor.departmentId } : {}),
    })
      .populate("departmentId")
      .sort({ updatedAt: -1 });

    return Promise.all(posts.map((post) => postService.mapDecryptedPost(post)));
  }

  async approve(postId, actor, comment) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    post.status = "APPROVED";
    await post.save();

    await PostApproval.create({
      postId,
      reviewerId: actor.id,
      action: "APPROVED",
      comment,
    });

    return post;
  }

  async reject(postId, actor, comment) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    post.status = "REJECTED";
    await post.save();

    await PostApproval.create({
      postId,
      reviewerId: actor.id,
      action: "REJECTED",
      comment,
    });

    return post;
  }
}

module.exports = new ApprovalService();

