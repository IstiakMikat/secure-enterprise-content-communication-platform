const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    purpose: { type: String, required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTPVerification", otpVerificationSchema);

