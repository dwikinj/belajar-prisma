const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = new express.Router();
const prisma = new PrismaClient();

const xprisma = prisma.$extends({
  query: {
    user: {
      async createMany({ args, query }) {
        await query(args);
        return args.data;
      },
    },
  },
});

//GET /users?houseOwned=true
//GET /user?limit=10&skip=0
//GET /user?sortBy=createdAt:desc

/*
** sortBy firstName ///sortBy=1
** sort by houseOwned //sortBy=2
** sort by houseBuilt //sortBy=3
** sort by Age //sortBy=4
** get user when id provided

 */
router.get("/users", async (req, res) => {
  let orderBy = [];
  let cursor;
  let take;
  let include = {}
  if (req.query.sortBy) {
    const valueOfSort = parseInt(req.query.sortBy);
    if (valueOfSort === 1) {
      orderBy.push({
        firstName: "asc",
      });
    } else if (valueOfSort === 2) {
      orderBy.push({
        houseOwned: { _count: "desc" },
      });
    } else if (valueOfSort === 3) {
      orderBy.push({
        houseBuilt: { _count: "desc" },
      });
    } else if (valueOfSort === 4) {
      orderBy.push({
        age: "asc",
      });
    } else {
      return res.status(404).send({ error: "404 Page Not Found" });
    }

    include = {
      houseOwned: true,
      houseBuilt: true,
    }


  }
  
  //   /users?cursor=1&take=5
  if(req.query.cursor) {
    take = parseInt(req.query.take) || 5;
    cursor = {id: parseInt(req.query.cursor) ? parseInt(req.query.cursor) : 1}
    orderBy = orderBy.length != 0 ? orderBy : { id : 'asc'}
    include = {
      houseOwned: false,
      houseBuilt: false,
    }

  }

  try {
    const users = await prisma.user.findMany({
      take,
      cursor,
      orderBy,
      include,
    });
    if (users.length === 0) {
      return res.send({});
    }
    if (users === undefined) {
      return res.status(404).send({ error: "404 users not found" });
    }

    res.json(users);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

router.get("/users/:id", async (req, res) => {
  if (req.params.id) {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: parseInt(req.params.id),
        },
        include: {
          houseOwned: true,
          houseBuilt: true,
        },
      });
      res.send(user);
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).send({ error: "404 User not found" });
      } else {
        res.status(500).send({ error: "Something error" });
      }
    }
  }
});

router.post("/user", async (req, res) => {
  try {
    const newUser = await xprisma.user.createMany({
      data: req.body,
    });
    res.send(newUser);
  } catch (error) {
    res.status(500).send({ error: "Something wrong" });
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: req.body,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        age: true,
      },
    });
    res.send({ user });
  } catch (error) {
    if (error.meta.cause) {
      res.status(404).send({ error: error.meta.cause });
    }
    res.status(500).send({ error });
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    res.status(200).send(user);
  } catch (error) {
    if (error.meta.cause) {
      res.status(404).send({ error: error.meta.cause });
    }
    res.status(500).send({ error });
  }
});

module.exports = router;
