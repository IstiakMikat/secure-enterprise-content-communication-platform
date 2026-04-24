const mongoose = require("mongoose");

const integrityAlertSchema = new mongoose.Schema(
  {
    resourceType: { type: String, required: true },
    resourceId: { type: String, required: true },
    severity: { type: String, default: "HIGH" },
    status: { type: String, default: "OPEN" },
    message: { type: String, required: true },
    detectedAt: { type: Date, default: Date.now },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IntegrityAlert", integrityAlertSchema);

