const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: String,
    permissions: [{ type: String }],
    isSystem: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);

