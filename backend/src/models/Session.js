const mongoose = require("mongoose");
const { deviceInfoSchema } = require("./subschemas");

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, index: true },
    device: deviceInfoSchema,
    ipAddress: String,
    userAgent: String,
    expiresAt: { type: Date, required: true },
    isSuspicious: { type: Boolean, default: false },
    revokedAt: Date,
    lastSeenAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);

