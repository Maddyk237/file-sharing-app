const express = require("express");
const File = require("../models/File");
const upload = require("../config/multer");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();
const User = require("../models/user");

router.post(
  "/upload",
  authMiddleware,
  upload.array("files", 10),
  async (req, res) => {
    try {
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const savedFiles = [];

      for (const file of files) {
        const newFile = await File.create({
          owner: req.user.id,
          originalName: file.originalname,
          fileName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
        });

        savedFiles.push(newFile);
      }

      res.status(201).json({
        message: "Files uploaded successfully",
        files: savedFiles,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.get("/", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ owner: req.user.id }).sort({
      uploadDate: -1,
    });

    res.json(files);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/download", authMiddleware, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const isOwner = file.owner.toString() === req.user.id;
    const isAllowed = file.allowedUsers
      .map((u) => u.toString())
      .includes(req.user.id);

    if (!isOwner && !isAllowed) {
      return res.status(403).json({ message: "Access denied" });
    }

    const filePath = `uploads/${file.fileName}`;
    res.download(filePath, file.originalName);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/share", authMiddleware, async (req, res) => {
  const { email } = req.body;

  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ message: "User not found" });
    }
    const alreadyShared = file.allowedUsers
      .map((u) => u.toString())
      .includes(userToShare._id.toString());

    if (!alreadyShared) {
      file.allowedUsers.push(userToShare._id);
      await file.save();
    }

    res.json({ message: `File shared with ${email}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/shared-with-me", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({
      allowedUsers: req.user.id,
    }).populate("owner", "email");

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
