const mongoose = require("mongoose");

const employeeAnalyticsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postsCreated: { type: Number, default: 0 },
    postsApproved: { type: Number, default: 0 },
    postsRejected: { type: Number, default: 0 },
    draftCount: { type: Number, default: 0 },
    loginCount: { type: Number, default: 0 },
    lastCalculatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployeeAnalytics", employeeAnalyticsSchema);

