const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const prisma = new PrismaClient();
const Folder = require("./Folder");
class File {
  static async create(data, fileBuffer) {
    try {
      const uploadResult = await this.uploadToCloudinary(fileBuffer);
      console.log("Upload result:", uploadResult);
      const file = await prisma.file.create({
        data: {
          name: data.name,
          url: uploadResult.secure_url,
          size: uploadResult.bytes,
          folderId: data.folderId,
          public_id: uploadResult.public_id,
        },
      });
      const folder = await Folder.findByIdAndUpdate(file.folderId, file.url);

      return file;
    } catch (err) {
      console.error("Error Creating File:", err);
      throw err;
    }
  }

  static uploadToCloudinary(fileBuffer) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "file_uploader_odin" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }
  static async findById(id) {
    return prisma.file.findUnique({ where: { id } });
  }

  static async delete(id) {
    const file = await this.findById(id);
    if (!file) throw new Error("File not found");
    await Folder.findByIdAndUpdate(file.folderId, "/assets/folder.jpg");

    try {
      await cloudinary.uploader.destroy(file.public_id);
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
      throw new Error("Error deleting file from Cloudinary");
    }

    await prisma.file.delete({ where: { id } });

    return file.folderId;
  }

  static async findByFolderId(folderId) {
    return prisma.file.findMany({
      where: { folderId },
    });
  }
}

module.exports = File;
