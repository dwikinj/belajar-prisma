const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { users, houses } = require("./data");

const load = async () => {
  try {
    //delete All Users and Houses
    await prisma.house.deleteMany({});
    await prisma.user.deleteMany({});

    //reset auto increment to 1
    await prisma.$queryRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
    await prisma.$queryRaw`ALTER TABLE House AUTO_INCREMENT = 1`;

    //seeding data to database
    await prisma.user.createMany({
      data: users,
    });
    await prisma.house.createMany({
      data: houses,
    });
    console.log("Seeding DB success");
  } catch (e) {
    console.log(e);
  }
};

load();