const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const Post = require("../models/Post");
const User = require("../models/User");
const controllerFactory = require("../modules/controller-factory");

const postController = controllerFactory(Post);
const router = Router();

router.route("/").get(postController.getAllDocuments());
router
  .route("/create")
  .post(isAuth(), postController.createOneWithRelations(User, "posts"));
router
  .route("/:id")
  .get(postController.getOneDocument())
  .put(isAuth(), postController.updateOne)
  .delete(isAuth(), postController.deleteOneWithRelations(User, "posts"));

module.exports = router;
