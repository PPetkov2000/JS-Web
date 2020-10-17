const Accessory = require("../models/Accessory");
const Cube = require("../models/Cube");

module.exports = {
  createAccessoryPage(req, res) {
    res.render("accessory/create");
  },
  async createAccessory(req, res) {
    const { name, description, imageUrl } = req.body;

    if (
      name.length < 5 ||
      description.length < 20 ||
      !imageUrl.match(/(http:\/\/|https:\/\/).+/)
    ) {
      return res.render("accessory/create", {
        error: "Invalid data!",
        name,
        description,
        imageUrl,
      });
    }

    const accessory = new Accessory({ name, description, imageUrl });

    try {
      await accessory.save();
      res.status(201).redirect("/");
    } catch (err) {
      console.log(err);
    }
  },
  async attachAccessoryPage(req, res) {
    const id = req.params.id;

    try {
      const cube = await Cube.findById(id).lean();
      const availableAccessories = await Accessory.find({
        cubes: { $nin: id },
      }).lean();

      res.render("accessory/attach", {
        ...cube,
        availableAccessories,
        hasAvailableAccessories: availableAccessories.length > 0,
      });
    } catch (err) {
      console.log(err);
    }
  },
  async attachAccessory(req, res) {
    const id = req.params.id;
    const accessory = req.body.accessory;

    try {
      const selectedAccessory = await Accessory.findOne({
        name: accessory,
      }).lean();
      await Cube.updateOne(
        { _id: id },
        { $push: { accessories: selectedAccessory._id } }
      );
      await Accessory.updateOne(
        { _id: selectedAccessory._id },
        { $push: { cubes: id } }
      );
      res.status(200).redirect(`/details/${id}`);
    } catch (err) {
      console.log(err);
    }
  },
};
