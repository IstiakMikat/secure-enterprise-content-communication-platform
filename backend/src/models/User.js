const mongoose = require("mongoose");
const { encryptedFieldSchema } = require("./subschemas");

const userSchema = new mongoose.Schema(
  {
    employeeId: encryptedFieldSchema,
    username: encryptedFieldSchema,
    fullName: encryptedFieldSchema,
    email: encryptedFieldSchema,
    phone: encryptedFieldSchema,
    designation: encryptedFieldSchema,
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    accountStatus: { type: String, default: "PENDING_OTP" },
    publicKeyRef: { type: mongoose.Schema.Types.ObjectId, ref: "CryptoKey" },
    biometricEnabled: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: Date,
    lastLoginAt: Date,
    lastLoginIp: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

