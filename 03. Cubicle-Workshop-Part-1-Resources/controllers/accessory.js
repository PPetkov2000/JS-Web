const Accessory = require("../models/Accessory");
const Cube = require("../models/Cube");

module.exports = {
  createAccessoryPage(req, res) {
    res.render("accessory/create", { isLoggedIn: req.user != null });
  },
  async createAccessory(req, res) {
    const { name, description, imageUrl } = req.body;
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
      const accessories = await Accessory.find().lean();
      const availableAccessories = accessories.reduce((acc, curr) => {
        const accessoryId = String(curr._id);
        const ids = cube.accessories.map((cubeAccessory) =>
          String(cubeAccessory._id)
        );
        if (!ids.includes(accessoryId)) {
          acc.push(curr);
        }
        return acc;
      }, []);

      res.render("accessory/attach", {
        ...cube,
        availableAccessories,
        isLoggedIn: req.user != null,
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
      await Accessory.updateOne({ _id: selectedAccessory._id }, { cubes: id });
      res.status(200).redirect(`/details/${id}`);
    } catch (err) {
      console.log(err);
    }
  },
};
