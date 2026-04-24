const mongoose = require("mongoose");

const keyRotationLogSchema = new mongoose.Schema(
  {
    keyId: { type: mongoose.Schema.Types.ObjectId, ref: "CryptoKey", required: true },
    previousKeyId: { type: mongoose.Schema.Types.ObjectId, ref: "CryptoKey" },
    actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("KeyRotationLog", keyRotationLogSchema);

