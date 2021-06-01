const { Router } = require("express");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");

module.exports.connect = function (app) {
  const router = Router();

  router.use("/users", userRouter);
  router.use("/posts", postRouter);

  app.use(router);
};

// module.exports.connect = function (path, app) {
//   const router = Router();

//   router.use("/users", userRouter);
//   router.use("/posts", postRouter);

//   app.use(path, router);
// };
