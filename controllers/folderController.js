const Folder = require("../models/Folder");

const folderCreateGet = (req, res) => {
  res.render("layout", { page: "pages/folderForm", title: "Create Folder" });
};

const folderCreatePost = async (req, res, next) => {
  const folderData = { name: req.body.name, userId: req.user.id };

  try {
    const folder = await Folder.create(folderData);

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
    const folder = await Folder.findById(req.params.id);
    
    res.render("layout", { page: "pages/folderDetails", title: folder.name });
  } catch (err) {
    console.error("Error finding folder by id", err);
    next(err);
  }
};

module.exports = {
  folderCreateGet,
  folderCreatePost,
  folderIndexGet,
  folderDetailsGet
};
