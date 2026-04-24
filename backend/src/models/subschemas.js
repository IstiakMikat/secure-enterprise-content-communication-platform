const mongoose = require("mongoose");

const encryptedFieldSchema = new mongoose.Schema(
  {
    algorithm: { type: String, required: true },
    ciphertext: { type: String, required: true },
    mac: { type: String, required: true },
    keyFingerprint: { type: String, required: true },
  },
  { _id: false }
);

const deviceInfoSchema = new mongoose.Schema(
  {
    name: String,
    userAgent: String,
    ipAddress: String,
    platform: String,
  },
  { _id: false }
);

module.exports = { encryptedFieldSchema, deviceInfoSchema };

