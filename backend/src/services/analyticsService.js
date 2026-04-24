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

class AnalyticsService {
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
    return EmployeeAnalytics.find().populate("userId").sort({ postsCreated: -1 });
  }

  async getDepartmentOverview() {
    return DepartmentAnalytics.find().populate("departmentId").sort({ totalPosts: -1 });
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

