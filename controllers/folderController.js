const Folder = require("../models/Folder");
const File = require("../models/File");

const folderCreateGet = (req, res) => {
  res.render("layout", { page: "pages/folderForm", title: "Create Folder" });
};

const folderCreatePost = async (req, res, next) => {
  const folderData = { name: req.body.name, userId: req.user.id };

  try {
    await Folder.create(folderData);

    res.redirect("/");
  } catch (err) {
    console.error("Error Creating Folder", err);
    next(err);
  }
};

const folderIndexGet = async (req, res, next) => {
  try {
    const folders = await Folder.findByUserId(req.user.id);
    res.render("layout", {
      title: "Your Folders",
      page: "pages/folders",
      folders,
    });
  } catch (err) {
    console.error("Error Fetching Folders", err);
    next(err);
  }
};

const folderDetailsGet = async (req, res, next) => {
  try {
    const [folder, files] = await Promise.all([
      Folder.findById(req.params.id),
      File.findByFolderId(req.params.id),
    ]);

    res.render("layout", {
      page: "pages/folderDetails",
      title: folder.name,
      folder,
      files,
    });
  } catch (err) {
    console.error("Error finding folder by id", err);
    next(err);
  }
};

const folderDelete = async (req, res, next) => {
  try {
    await Folder.delete(req.params.id);
    res.redirect("/folder");
  } catch (err) {
    console.error("Error deleting folder", err);
    next(err);
  }
};

module.exports = {
  folderCreateGet,
  folderCreatePost,
  folderIndexGet,
  folderDetailsGet,
  folderDelete,
};
