require("dotenv").config();
const express = require("express");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const authRouter = require("./routes/auth");
const logger = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));
app.use(logger("dev"));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET || "cats",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
require("./config/passport")(app);
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("layout", { title: "Home", page: "pages/index" });
});
app.use("/", authRouter);
app.post("/log-in", (req, res, next) => {
  console.log("Login attempt:", req.body);
  passport.authenticate("local", (err, user, info) => {
    console.log("Passport authenticate result:", { err, user, info });

    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed
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

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
