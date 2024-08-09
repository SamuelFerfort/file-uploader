require("dotenv").config();
const express = require("express");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const authRouter = require("./routes/auth");
const filesRouter = require("./routes/filesRouter");
const folderRouter = require("./routes/folderRouter");
const shareRouter = require("./routes/shareRouter")
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const downloadFile = require("./controllers/downloadController");



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

app.use("/", authRouter);

app.use("/files", filesRouter);
app.use("/folder", folderRouter);
app.use("/share", shareRouter)
app.get('/download/:fileId', downloadFile);




app.get("/", (req, res) => {
  if (!req.user)
    return res.render("layout", { page: "pages/index", title: "Home" });

  res.redirect("/folder");
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
