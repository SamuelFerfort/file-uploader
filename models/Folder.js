const { PrismaClient } = require("@prisma/client");

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

  static async delete(id) {
    return prisma.folder.delete({ where: { id } });
  }

  static async findByUserId(userId) {
    return prisma.folder.findMany({
      where: { userId },
    });
  }
}

module.exports = Folder;
