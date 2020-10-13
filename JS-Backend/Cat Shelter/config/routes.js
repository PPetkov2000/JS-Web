const router = require("../routes/index");

module.exports = (app) => {
  app.use("/", router.home);

  app.use("/cats", router.cats);

  app.use("*", (req, res) => {
    res.send("Invalid page");
  });
};
