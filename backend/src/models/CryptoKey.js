const mongoose = require("mongoose");

const cryptoKeySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    algorithm: { type: String, enum: ["RSA", "ECC"], required: true },
    purpose: { type: String, required: true },
    publicKeyData: { type: mongoose.Schema.Types.Mixed, required: true },
    encryptedPrivateKeyData: { type: mongoose.Schema.Types.Mixed, required: true },
    keyFingerprint: { type: String, required: true, unique: true },
    status: { type: String, default: "ACTIVE" },
    assignedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expiresAt: Date,
    rotatedAt: Date,
    revokedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CryptoKey", cryptoKeySchema);

