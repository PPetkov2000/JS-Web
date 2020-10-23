const { Router } = require("express");
const { authenticate, validateUserData } = require("../middleware/auth");
const User = require("../models/User");
const controllerFactory = require("../modules/controller-factory");

const userController = controllerFactory(User);
const router = Router();

router.route("/").get(userController.getAll);
router.route("/register").post(validateUserData, userController.createOne);
router.route("/login").post(authenticate);
router
  .route("/:id")
  .get(userController.getOne)
  .put(userController.updateOne)
  .delete(userController.deleteOne);

module.exports = router;
