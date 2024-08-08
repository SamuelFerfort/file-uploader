const express = require("express");
const passport = require("passport");
const router = express.Router();
const controller = require("../controllers/authController")



router.get("/sign-up", controller.sign_up_form_get);

router.post("/sign-up", controller.sign_up_form_post)

router.get("/log-in", controller.login_get);




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
