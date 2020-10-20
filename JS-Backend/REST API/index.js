require("dotenv").config();
require("./config/database")();

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { port } = require("./config/config").development;
const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");
const errorHandler = require("./utils/errorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

app.use((error, req, res, next) => {
  if (error.message.includes("Cast to ObjectId failed")) {
    return res.status(404).json({ message: "Post not found!" });
  }
  if (error.message.includes("Post validation failed")) {
    const errors = errorHandler(error);
    return res.status(400).json({ errors });
  }
  // const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
  next();
});

app.listen(port, () => console.log(`Server started on port ${port}`));
