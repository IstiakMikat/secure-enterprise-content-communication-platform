const mongoose = require("mongoose");

const userProfileHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    beforeSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    afterSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    reason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfileHistory", userProfileHistorySchema);

