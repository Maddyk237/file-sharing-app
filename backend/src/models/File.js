const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  mimeType: String,
  size: Number,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  allowedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  shareToken: String,
  shareExpiry: Date,
});

module.exports = mongoose.model("File", FileSchema);
