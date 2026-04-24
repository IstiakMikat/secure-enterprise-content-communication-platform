const Post = require("../models/Post");
const PostVersion = require("../models/PostVersion");
const IntegrityAlert = require("../models/IntegrityAlert");
const cryptoService = require("./cryptoService");
const auditService = require("./auditService");
const AppError = require("../utils/AppError");
const { INTEGRITY_STATUS, POST_STATUS, ROLES } = require("../constants");

class PostService {
  async createPost(author, payload) {
    const title = await cryptoService.encryptField(payload.title, "ECC", "POST_CONTENT");
    const body = await cryptoService.encryptField(payload.body, "ECC", "POST_CONTENT");
    const integrityMac = cryptoService.createRecordMac({
      title: title.ciphertext,
      body: body.ciphertext,
      category: payload.category,
      visibilityLevel: payload.visibilityLevel,
    });

    const post = await Post.create({
      authorId: author.id,
      departmentId: author.departmentId || payload.departmentId,
      category: payload.category,
      title,
      body,
      visibilityLevel: payload.visibilityLevel,
      status: payload.submitForApproval
        ? POST_STATUS.PENDING_APPROVAL
        : POST_STATUS.DRAFT,
      integrityMac,
      integrityStatus: INTEGRITY_STATUS.VERIFIED,
      currentVersion: 1,
    });

    await PostVersion.create({
      postId: post._id,
      versionNumber: 1,
      title,
      body,
      changeSummary: "Initial version",
      editedBy: author.id,
    });

    await auditService.log({
      actorId: author.id,
      action: "POST_CREATED",
      resourceType: "POST",
      resourceId: String(post._id),
      meta: { category: payload.category },
    });

    return this.getPostById(post._id, author);
  }

  async listPosts(actor, filters = {}) {
    const query = {};
    if (actor.role !== ROLES.ADMIN) {
      query.departmentId = actor.departmentId;
    }
    if (filters.status) {
      query.status = filters.status;
    }

    const posts = await Post.find(query)
      .populate("authorId", "createdAt")
      .populate("departmentId")
      .sort({ updatedAt: -1 });

    return Promise.all(posts.map((post) => this.mapDecryptedPost(post)));
  }

  async listDrafts(actor) {
    const posts = await Post.find({
      authorId: actor.id,
      status: POST_STATUS.DRAFT,
    }).sort({ updatedAt: -1 });

    return Promise.all(posts.map((post) => this.mapDecryptedPost(post)));
  }

  async getPostById(postId, actor) {
    const post = await Post.findById(postId).populate("departmentId");
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (
      actor.role === ROLES.USER &&
      String(post.authorId) !== String(actor.id) &&
      String(post.departmentId?._id || post.departmentId) !== String(actor.departmentId)
    ) {
      throw new AppError("Not authorized to view this post", 403);
    }

    return this.mapDecryptedPost(post);
  }

  async updatePost(postId, actor, payload) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    const title = await cryptoService.encryptField(payload.title, "ECC", "POST_CONTENT");
    const body = await cryptoService.encryptField(payload.body, "ECC", "POST_CONTENT");
    const integrityMac = cryptoService.createRecordMac({
      title: title.ciphertext,
      body: body.ciphertext,
      category: payload.category || post.category,
      visibilityLevel: payload.visibilityLevel || post.visibilityLevel,
    });

    post.title = title;
    post.body = body;
    post.category = payload.category || post.category;
    post.visibilityLevel = payload.visibilityLevel || post.visibilityLevel;
    post.status = payload.submitForApproval
      ? POST_STATUS.PENDING_APPROVAL
      : post.status;
    post.currentVersion += 1;
    post.integrityMac = integrityMac;
    post.integrityStatus = INTEGRITY_STATUS.VERIFIED;
    await post.save();

    await PostVersion.create({
      postId,
      versionNumber: post.currentVersion,
      title,
      body,
      changeSummary: payload.changeSummary || "Post updated",
      editedBy: actor.id,
    });

    return this.getPostById(postId, actor);
  }

  async archivePost(postId) {
    return Post.findByIdAndUpdate(
      postId,
      { status: POST_STATUS.ARCHIVED },
      { new: true }
    );
  }

  async deletePost(postId) {
    return Post.findByIdAndDelete(postId);
  }

  async mapDecryptedPost(post) {
    const postObj = post.toObject ? post.toObject() : post;
    const integrityValid = cryptoService.verifyRecordMac(
      {
        title: postObj.title.ciphertext,
        body: postObj.body.ciphertext,
        category: postObj.category,
        visibilityLevel: postObj.visibilityLevel,
      },
      postObj.integrityMac
    );

    if (!integrityValid) {
      await IntegrityAlert.create({
        resourceType: "POST",
        resourceId: String(postObj._id),
        message: "Post integrity verification failed during retrieval.",
      });
      postObj.integrityStatus = INTEGRITY_STATUS.FAILED;
      await Post.findByIdAndUpdate(postObj._id, {
        integrityStatus: INTEGRITY_STATUS.FAILED,
      });
      throw new AppError("Integrity check failed. Post display blocked.", 409);
    }

    return {
      id: postObj._id,
      authorId: postObj.authorId,
      departmentId: postObj.departmentId?._id || postObj.departmentId,
      departmentName: postObj.departmentId?.name,
      category: postObj.category,
      title: await cryptoService.decryptField(postObj.title, "POST_CONTENT"),
      body: await cryptoService.decryptField(postObj.body, "POST_CONTENT"),
      visibilityLevel: postObj.visibilityLevel,
      status: postObj.status,
      currentVersion: postObj.currentVersion,
      integrityStatus: postObj.integrityStatus,
      createdAt: postObj.createdAt,
      updatedAt: postObj.updatedAt,
    };
  }
}

module.exports = new PostService();

