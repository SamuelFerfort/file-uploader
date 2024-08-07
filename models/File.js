const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const prisma = new PrismaClient();

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
        },
      });
      console.log("Upload result file:", file);

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
    return prisma.file.delete({ where: { id } });
  }

  static async findByFolderId(folderId) {
    return prisma.file.findMany({
      where: { folderId },
    });
  }
}

module.exports = File;
