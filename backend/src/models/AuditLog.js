const mongoose = require("mongoose");
const { deviceInfoSchema } = require("./subschemas");

const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: String,
    severity: { type: String, default: "INFO" },
    ipAddress: String,
    device: deviceInfoSchema,
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);

