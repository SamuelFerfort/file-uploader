const express = require("express");
const controller = require("../controllers/folderController");
const router = express.Router();

const checkAuthentication = require("../middleware/checkAuthentication");

router.use(checkAuthentication);

router.get("/", controller.folderIndexGet);



router.get("/create", controller.folderCreateGet);

router.post("/create", controller.folderCreatePost);


router.get("/:id", controller.folderDetailsGet);
module.exports = router;
