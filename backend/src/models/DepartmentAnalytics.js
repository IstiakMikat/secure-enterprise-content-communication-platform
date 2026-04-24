const mongoose = require("mongoose");

const departmentAnalyticsSchema = new mongoose.Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    totalPosts: { type: Number, default: 0 },
    approvedPosts: { type: Number, default: 0 },
    pendingPosts: { type: Number, default: 0 },
    rejectedPosts: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    lastCalculatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DepartmentAnalytics", departmentAnalyticsSchema);

