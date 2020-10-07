const Accessory = require("../models/Accessory");
const Cube = require("../models/Cube");

module.exports = {
  async getCubes(req, res) {
    const { search, from, to } = req.query;

    try {
      let cubes = await Cube.find().lean();
      if (
        search != null &&
        search !== "" &&
        from != null &&
        from !== "" &&
        to != null &&
        to !== ""
      ) {
        cubes = cubes.filter(
          (cube) =>
            cube.name.toLowerCase().includes(search.toLowerCase()) &&
            cube.difficultyLevel >= Number(from) &&
            cube.difficultyLevel <= Number(to)
        );
      }
      res.render("home/home", { cubes, isLoggedIn: req.user != null });
    } catch (err) {
      console.log(err);
    }
  },
  createCubePage(req, res) {
    res.render("cube/create", { isLoggedIn: req.user != null });
  },
  async createCube(req, res) {
    const { name, description, imageUrl, difficultyLevel } = req.body;

    if (
      name.length < 5 ||
      description.length < 20 ||
      !imageUrl.match(/(http:\/\/|https:\/\/).+/)
    ) {
      return res.render("cube/create", {
        isLoggedIn: req.user != null,
        error: "Invalid data!",
        name,
        description,
        imageUrl,
      });
    }

    const cube = new Cube({
      name,
      description,
      imageUrl,
      difficultyLevel: Number(difficultyLevel),
      creatorId: req.user._id,
    });

    try {
      await cube.save();
      res.status(201).redirect("/");
    } catch (err) {
      console.log(err);
    }
  },
  async detailsPage(req, res) {
    const id = req.params.id;

    try {
      const cube = await Cube.findById(id).populate("accessories").lean();
      res.render("cube/details", {
        ...cube,
        isAuthorized:
          req.user != null &&
          JSON.stringify(req.user._id) === JSON.stringify(cube.creatorId),
      });
    } catch (err) {
      console.log(err);
    }
  },
  async editPage(req, res) {
    const id = req.params.id;

    try {
      const cube = await Cube.findById(id).lean();
      if (String(req.user._id) !== String(cube.creatorId)) {
        return res.status(401).redirect("/");
      }
      res.render("cube/edit", { ...cube, isLoggedIn: req.user != null });
    } catch (err) {
      console.log(err);
    }
  },
  async deletePage(req, res) {
    const id = req.params.id;

    try {
      const cube = await Cube.findById(id).lean();
      if (String(req.user._id) !== String(cube.creatorId)) {
        return res.status(401).redirect("/");
      }
      res.render("cube/delete", { ...cube, isLoggedIn: req.user != null });
    } catch (err) {
      console.log(err);
    }
  },
  async editCube(req, res) {
    const id = req.params.id;
    const { name, description, imageUrl, difficultyLevel } = req.body;

    try {
      await Cube.updateOne(
        { _id: id },
        { $set: { name, description, imageUrl, difficultyLevel } }
      );
      res.status(200).redirect(`/details/${id}`);
    } catch (err) {
      console.log(err);
    }
  },
  async deleteCube(req, res) {
    const id = req.params.id;

    try {
      await Cube.deleteOne({ _id: id });
      await Accessory.updateMany(
        { cubes: { $in: [String(id)] } },
        { $pull: { cubes: String(id) } }
      );
      res.status(200).redirect("/");
    } catch (err) {
      console.log(err);
    }
  },
};
