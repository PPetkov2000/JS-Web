const router = require("express").Router();
const controllers = require("../controllers/index");

router.get("/", controllers.home.get.listAllCats);
router.get("/search", controllers.home.get.searchCat);

module.exports = router;
