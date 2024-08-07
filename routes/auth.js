const express = require("express");

const router = express.Router();

// instantiate the client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

// when creating a new message

router.get("/sign-up", (req, res) => {
  res.render("layout", {
    page: "pages/signup",
    title: "Sign Up",
  });
});

router.post("/sign-up", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.redirect("login");
  } catch (err) {
    next(err);
  }
});

router.get("/log-in", (req, res) => {
  res.render("layout", {
    page: "pages/login",
    title: "Log In",
  });
});

router.post("/log-in", (req, res) => {});

router.get("/log-out", (req, res) => {});

module.exports = router;
