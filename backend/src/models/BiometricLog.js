const mongoose = require("mongoose");
const { deviceInfoSchema } = require("./subschemas");

const biometricLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    result: { type: String, required: true },
    confidenceScore: Number,
    device: deviceInfoSchema,
    ipAddress: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BiometricLog", biometricLogSchema);

