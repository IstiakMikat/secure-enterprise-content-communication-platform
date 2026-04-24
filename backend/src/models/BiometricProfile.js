const mongoose = require("mongoose");
const { encryptedFieldSchema } = require("./subschemas");

const biometricProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    templateVector: encryptedFieldSchema,
    provider: { type: String, default: "ACADEMIC_FACEPRINT" },
    isEnabled: { type: Boolean, default: true },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BiometricProfile", biometricProfileSchema);

