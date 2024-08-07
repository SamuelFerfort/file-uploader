const Folder = require("../models/Folder")
const File = require("../models/File")
const fileUploadGet = async (req, res) => {

    const folders = await Folder.findByUserId(req.user.id)
  res.render("layout", { page: "pages/fileUpload", title: "Upload file", folders });
};


const uploadFile = async(req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  if (!req.body.folderId) {
    return res.status(400).send("Please select a folder");
  }

  try {
    const file = await File.create({
      name: req.body.name || req.file.originalname,
      folderId: req.body.folderId
     }, req.file.buffer)

     console.log(file)
     res.redirect(`/folder/${req.body.folderId}`)
  } catch (error) {
    console.error('Error in uploadFile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
}

module.exports = {
  fileUploadGet,
  uploadFile
};
