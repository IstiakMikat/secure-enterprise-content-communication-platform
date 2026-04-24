const mongoose = require("mongoose");
const { encryptedFieldSchema } = require("./subschemas");

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    category: { type: String, required: true },
    title: encryptedFieldSchema,
    body: encryptedFieldSchema,
    visibilityLevel: { type: String, default: "DEPARTMENT" },
    status: { type: String, default: "DRAFT" },
    integrityMac: { type: String, required: true },
    integrityStatus: { type: String, default: "PENDING" },
    currentVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

