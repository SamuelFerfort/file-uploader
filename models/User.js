const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class User {
  static async create({ username, password, email }) {
    return prisma.user.create({
      data: {
        username,
        password,
        email,
      },
    });
  }

  static async findOne({email}) {
    return prisma.user.findUnique({ where: { email } });
  }
}

module.exports = User;
