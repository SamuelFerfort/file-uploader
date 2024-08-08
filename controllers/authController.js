const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const bcrypt = require("bcrypt");

exports.sign_up_form_get = (req, res) => {
  res.render("layout", {
    page: "pages/signup",
    title: "Sign Up",
  });
};

exports.sign_up_form_post = [
  body("email", "Email must not be empty")
    .isEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already in use");
      }
    })
    .trim()
    .isLength({ min: 1 }),
  body("username", "Username must not be empty")
    .trim()
    .isAlphanumeric()
    .withMessage("Only alphanumeric characters for username")
    .isLength({ min: 1 }),
  body("password", "password must not be empty")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters"),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("layout", {
        page: "pages/signup",
        title: "Sign Up",
        errors: errors.array(),
        username: req.body.username,
        password: req.body.password,
        passwordC: req.body["confirm-password"],
        email: req.body.email,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    };
    try {
      await User.create(user);
      res.redirect("/log-in");
    } catch (error) {
      next(error);
    }
  },
];

exports.login_get = (req, res) => {
  res.render("layout", {
    page: "pages/login",
    title: "Log In",
  });
};

exports.login_post = [
  body("email", "Email must not be empty").isEmail(),
  body("password", "Password must not be empty").notEmpty(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("layout", {
        page: "pages/login",
        title: "Log In",
        errors: errors.array(),
        email: req.body.email,
      });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.render("layout", {
          page: "pages/login",
          title: "Log In",
          errors: [{ msg: info.message }],
          email: req.body.email,
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    })(req, res, next);
  },
];