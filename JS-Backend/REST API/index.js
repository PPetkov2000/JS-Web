require("dotenv").config();
require("./config/database")();

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { port } = require("./config/config").development;
const api = require("./api");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

api.connect(app);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
