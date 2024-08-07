const Folder = require("../models/Folder")

const fileUploadGet = async (req, res) => {

    const folders = await Folder.findByUserId(req.user.id)
  res.render("layout", { page: "pages/fileUpload", title: "Upload file", folders });
};

module.exports = {
  fileUploadGet,
};
