const express = require("express");
const multer = require("multer");

const checkAuthentication = require("../middleware/checkAuthentication")
const controller = require("../controllers/fileController")

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.use(checkAuthentication)

router.get("/upload/", controller.fileUploadGet)

router.post("/upload", upload.single("file"), controller.uploadFile);

router.post("/delete/:id", controller.deleteFile)

module.exports = router;
