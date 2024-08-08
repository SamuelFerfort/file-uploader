const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../config/cloudinary");
const prisma = new PrismaClient();

class Folder {
  static async create(folderData) {
    const { name, userId } = folderData;
    return prisma.folder.create({
      data: {
        name,
        userId,
      },
    });
  }

  static async findById(id) {
    return prisma.folder.findUnique({ where: { id } });
  }

  static async findByIdAndUpdate(id, previewImageUrl) {
    return prisma.folder.update({
      where: { id },
      data: { previewImageUrl },
    });
  }
  static async delete(id) {
    const files = await prisma.file.findMany({ where: { folderId: id } });

    if (files.length > 0) {
      const deleteFilePromises = files.map(file => cloudinary.uploader.destroy(file.public_id));

      await Promise.all(deleteFilePromises)
    }

    await prisma.file.deleteMany({ where: { folderId: id } });
    return prisma.folder.delete({ where: { id } });
  }

  static async findByUserId(userId) {
    return prisma.folder.findMany({
      where: { userId },
    });
  }
}

module.exports = Folder;
