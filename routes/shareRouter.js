const express = require("express");
const controller = require("../controllers/shareController");
const router = express.Router();

router.get("/:id", controller.shareFolderGet);

router.post("/:id", controller.shareFolderPost);

router.get("/folder/:shareId", controller.shareFolderLinkGet)

module.exports = router;
