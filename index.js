const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const PORT = 3000 || process.env.PORT;
const userRoutes = require("./src/routes/user");
const houseRoutes = require("./src/routes/house");
const app = express();

app.use(express.json());

app.use(userRoutes);
app.use(houseRoutes);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
