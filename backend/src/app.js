const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const env = require("./config/env");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const sessionContextMiddleware = require("./middlewares/sessionContextMiddleware");

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(sessionContextMiddleware);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Secure Enterprise Platform API is running.",
  });
});

app.use("/api", routes);
app.use(errorHandler);

module.exports = app;

