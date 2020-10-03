const {
  getCubes,
  createCubePage,
  createCube,
  detailsPage,
  editPage,
  deletePage,
  editCube,
  deleteCube,
} = require("../controllers/cube");
const {
  createAccessoryPage,
  createAccessory,
  attachAccessoryPage,
  attachAccessory,
} = require("../controllers/accessory");
const {
  registerPage,
  loginPage,
  logoutUser,
  registerUser,
  loginUser,
} = require("../controllers/user");
const isAuth = require("../utils/isAuth");

module.exports = (app) => {
  app.get("/", isAuth(true), getCubes);
  app.get("/about", isAuth(true), (req, res) =>
    res.render("about", { isLoggedIn: req.user != null })
  );
  app.get("/create", isAuth(), createCubePage);
  app.post("/create", isAuth(), createCube);
  app.get("/create/accessory", isAuth(), createAccessoryPage);
  app.post("/create/accessory", createAccessory);
  app.get("/attach/accessory/:id", isAuth(), attachAccessoryPage);
  app.post("/attach/accessory/:id", attachAccessory);
  app.get("/details/:id", isAuth(true), detailsPage);
  app.get("/edit/:id", isAuth(), editPage);
  app.put("/edit/:id", isAuth(), editCube);
  app.get("/delete/:id", isAuth(), deletePage);
  app.delete("/delete/:id", isAuth(), deleteCube);
  app.get("/user/register", isAuth(true), registerPage);
  app.get("/user/login", isAuth(true), loginPage);
  app.get("/user/logout", logoutUser);
  app.post("/user/register", registerUser);
  app.post("/user/login", loginUser);
  app.use("*", (req, res) => res.render("partials/404"));
};
