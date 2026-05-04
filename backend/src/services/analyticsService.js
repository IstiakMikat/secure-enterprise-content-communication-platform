const User = require("../models/User");
const Department = require("../models/Department");
const Post = require("../models/Post");
const Session = require("../models/Session");
const IntegrityAlert = require("../models/IntegrityAlert");
const CryptoKey = require("../models/CryptoKey");
const OTPVerification = require("../models/OTPVerification");
const AuditLog = require("../models/AuditLog");
const EmployeeAnalytics = require("../models/EmployeeAnalytics");
const DepartmentAnalytics = require("../models/DepartmentAnalytics");
const authService = require("./authService");

class AnalyticsService {
  async getMyOverview(actor) {
    const [drafts, totalPosts, notifications, sessions] = await Promise.all([
      Post.countDocuments({ authorId: actor.id, status: "DRAFT" }),
      Post.countDocuments({ authorId: actor.id }),
      require("../models/Notification").countDocuments({ userId: actor.id, readAt: null }),
      Session.countDocuments({
        userId: actor.id,
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
      }),
    ]);

    const postsByStatus = await Post.aggregate([
      { $match: { authorId: actor.id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const recentPosts = await Post.find({ authorId: actor.id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("category status updatedAt");

    return {
      totalPosts,
      drafts,
      unreadNotifications: notifications,
      activeSessions: sessions,
      postsByStatus,
      recentPosts,
    };
  }

  async getCompanyOverview() {
    const [totalUsers, departments, totalPosts, activeSessions, integrityAlerts, keys] =
      await Promise.all([
        User.countDocuments(),
        Department.countDocuments(),
        Post.countDocuments(),
        Session.countDocuments({ revokedAt: { $exists: false } }),
        IntegrityAlert.countDocuments({ status: "OPEN" }),
        CryptoKey.find(),
      ]);

    const postsByStatus = await Post.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const postsByCategory = await Post.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    return {
      totalUsers,
      totalDepartments: departments,
      totalPosts,
      activeSessions,
      integrityAlerts,
      postsByStatus,
      postsByCategory,
      keysSummary: {
        active: keys.filter((key) => key.status === "ACTIVE").length,
        revoked: keys.filter((key) => key.status === "REVOKED").length,
        expired: keys.filter((key) => key.status === "EXPIRED").length,
      },
    };
  }

  async getEmployeePerformance() {
    const entries = await EmployeeAnalytics.find()
      .populate({
        path: "userId",
        populate: ["roleId", "departmentId"],
      })
      .sort({ postsCreated: -1 });

    return Promise.all(
      entries.map(async (entry) => ({
        id: entry._id,
        user: entry.userId ? await authService.buildUserProfile(entry.userId) : null,
        postsCreated: entry.postsCreated,
        postsApproved: entry.postsApproved,
        postsRejected: entry.postsRejected,
        draftCount: entry.draftCount,
        loginCount: entry.loginCount,
        lastCalculatedAt: entry.lastCalculatedAt,
      }))
    );
  }

  async getDepartmentOverview() {
    const entries = await DepartmentAnalytics.find()
      .populate("departmentId")
      .sort({ totalPosts: -1 });

    return entries.map((entry) => ({
      id: entry._id,
      department: entry.departmentId?.name,
      totalPosts: entry.totalPosts,
      approvedPosts: entry.approvedPosts,
      pendingPosts: entry.pendingPosts,
      rejectedPosts: entry.rejectedPosts,
      activeUsers: entry.activeUsers,
      lastCalculatedAt: entry.lastCalculatedAt,
    }));
  }

  async getSecurityOverview() {
    const [failedLogins, suspiciousSessions, otpFailures, integrityAlerts, keySummary] =
      await Promise.all([
        AuditLog.countDocuments({ action: "LOGIN_FAILED" }),
        Session.countDocuments({ isSuspicious: true, revokedAt: { $exists: false } }),
        OTPVerification.countDocuments({ attempts: { $gt: 0 }, isUsed: false }),
        IntegrityAlert.countDocuments({ status: "OPEN" }),
        CryptoKey.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      ]);

    return {
      failedLogins,
      suspiciousSessions,
      otpFailures,
      integrityAlerts,
      keySummary,
    };
  }
}

module.exports = new AnalyticsService();
