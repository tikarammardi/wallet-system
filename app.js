const express = require("express");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const walletRouter = require("./routes/wallet.route");
require("./lib/connection").connectDB();
const expressListRoutes = require("express-list-routes");
const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", walletRouter);

app.get("/ping", (req, res) => {
  return res.send({
    error: false,
    message: "Server is running",
  });
});

expressListRoutes(app);
module.exports = app;
