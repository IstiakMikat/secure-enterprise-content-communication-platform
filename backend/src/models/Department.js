const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: String,
    visibilityScope: { type: String, default: "INTERNAL" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);

