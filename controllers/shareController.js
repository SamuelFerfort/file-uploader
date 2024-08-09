const Folder = require("../models/Folder");
const File = require("../models/File");
const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.shareFolderPost = [
  body("days")
    .notEmpty()
    .withMessage("Number of days must not be empty")
    .isInt({ min: 1, max: 10 })
    .withMessage("Number of days must be between 1 and 10"),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("layout", {
        page: "pages/shareForm",
        title: "Share Folder",
        errors: errors.array(),
      });
    }

    try {
      const folderId = req.params.id;
      const { days } = req.body;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(days));

      const shareLink = await prisma.shareLink.create({
        data: {
          folderId,
          expiresAt,
        },
      });

      const shareLinkUrl = `${req.protocol}://${req.get(
        "host"
      )}/share/folder/${shareLink.id}`;

      res.render("layout", {
        page: "pages/shareForm",
        title: "Share Folder",
        shareLinkUrl,
      });
    } catch (err) {
        console.error("Error creating the share link:", err)
        next(err)
    }
  },
];

exports.shareFolderGet = async (req, res, next) => {
  res.render("layout", {
    page: "pages/shareForm",
    title: "Share Folder",
  });
};

exports.shareFolderLinkGet = async (req, res, next) => {
  try {
    const { shareId } = req.params;

    const shareLink = await prisma.shareLink.findUnique({
      where: { id: shareId },
      include: { folder: { include: { files: true } } },
    });

    if (!shareLink) {
      return res.status(404).json({ error: "Share link not found" });
    }

    if (new Date() > shareLink.expiresAt) {
      await prisma.shareLink.delete({ where: { id: shareId } });
      return res.status(410).json({ error: "Share link has expired" });
    }

    res.render("layout", {
      page: "pages/sharedFolder",
      title: shareLink.folder.name,
      folder: shareLink.folder,
      files: shareLink.folder.files,
    });
  } catch (err) {
    console.error("Error accessing shared folder:", err);
    next(err);
  }
};
