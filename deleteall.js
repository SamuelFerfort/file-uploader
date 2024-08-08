const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteAll() {
  await prisma.file.deleteMany();
}
