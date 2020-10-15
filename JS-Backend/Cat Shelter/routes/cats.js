const router = require("express").Router();
const controllers = require("../controllers/index");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploads/");
  },
  filename: function (req, file, cb) {
    let ext = "";
    if (file.originalname.split(".").length > 1) {
      ext = file.originalname.substring(file.originalname.lastIndexOf("."));
    }
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage: storage });

router.get("/add-cat", controllers.cats.get.addCatPage);
router.get("/add-breed", controllers.cats.get.addCatBreedPage);
router.get("/edit/:id", controllers.cats.get.editCatPage);
router.get("/shelter/:id", controllers.cats.get.shelterCatPage);

router.post("/add-cat", upload.single("upload"), controllers.cats.post.addCat);
router.post("/add-breed", controllers.cats.post.addCatBreed);

router.put("/edit/:id", upload.single("upload"), controllers.cats.put.editCat);
router.delete("/shelter/:id", controllers.cats.delete.shelterCat);

module.exports = router;
