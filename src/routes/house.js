const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = new express.Router();
const prisma = new PrismaClient();

router.get("/house", async (req, res) => {
  try {
    const house = await prisma.house.findMany();
    if (house.length === 0){
        return res.send({})
    }
    res.json(house);
  } catch (error) {
    res.status(500).send({error});
  }
});

router.post("/house", async (req, res) => {
  try {
    const newhouse = await prisma.house.createMany({
      data: req.body,
    });
    res.send(newhouse);
  } catch (error) {
    res.status(500).send({ error: "Something wrong" });
  }
});

router.put("/house/:id", async (req, res) => {
  try {
    const houseId = parseInt(req.params.id, 10);
    const house = await prisma.house.update({
      where: {
        id: houseId,
      },
      data: req.body,
    });
    res.send({ house });
  } catch (error) {
    if (error.meta.cause) {
      res.status(404).send({ error: error.meta.cause });
    }
    res.status(500).send({ error });
  }
});

router.delete("/house/:id", async (req, res) => {
  try {
    const houseId = parseInt(req.params.id,10);
    const house = await prisma.house.delete({
      where: {
        id: houseId,
      },
    });
    res.status(200).send(house)
  } catch (error) {
    if (error.meta.cause) {
        res.status(404).send({ error: error.meta.cause });
      }
    res.status(500).send({ error });
  }
});

module.exports = router;