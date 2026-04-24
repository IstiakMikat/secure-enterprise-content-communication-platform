const mongoose = require("mongoose");
const { encryptedFieldSchema } = require("./subschemas");

const postVersionSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    versionNumber: { type: Number, required: true },
    title: encryptedFieldSchema,
    body: encryptedFieldSchema,
    changeSummary: String,
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PostVersion", postVersionSchema);

