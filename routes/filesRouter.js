const express = require("express");
const multer = require("multer");

const checkAuthentication = require("../middleware/checkAuthentication")


const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/data/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.use(checkAuthentication)

router.post("/upload", upload.single("uploaded_file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.send("File uploaded successfully: " + req.file.path);
});

module.exports = router;
