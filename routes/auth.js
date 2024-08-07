const express = require("express");
const passport = require("passport");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");


router.get("/sign-up", (req, res) => {
  res.render("layout", {
    page: "pages/signup",
    title: "Sign Up",
  });
});

router.post("/sign-up", async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.redirect("/login");
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

router.post("/log-in", (req, res, next) => {
  console.log("Login attempt:", req.body);
  passport.authenticate("local", (err, user, info) => {
    console.log("Passport authenticate result:", { err, user, info });

    if (err) {
      return next(err);
    }
    if (!user) {
      console.log(info.message);
      next(info.message);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    res.redirect("/");
  });
});

module.exports = router;
