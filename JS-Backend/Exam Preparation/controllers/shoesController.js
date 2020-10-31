const { Shoes, User } = require("../models");
const handleErrors = require("../utils/handleMongooseErrors");

module.exports = {
  get: {
    async allShoes(req, res, next) {
      try {
        const shoes = await Shoes.find().lean();
        res.render("shoes/allShoes", {
          shoes: shoes.sort((a, b) => b.buyers.length - a.buyers.length),
        });
      } catch (error) {
        console.log(error);
      }
    },
    create(req, res, next) {
      res.render("shoes/create");
    },
    async details(req, res, next) {
      try {
        const shoe = await Shoes.findById(req.params.id).lean();
        const isCreator = shoe.creator.toString() === req.user._id.toString();
        const isBought = shoe.buyers.includes(req.user.email);
        res.render("shoes/details", { ...shoe, isCreator, isBought });
      } catch (error) {
        console.log(error);
      }
    },
    async edit(req, res, next) {
      try {
        const shoe = await Shoes.findById(req.params.id).lean();
        res.render("shoes/edit", { ...shoe });
      } catch (error) {
        console.log(error);
      }
    },
  },
  post: {
    async create(req, res, next) {
      const { name, price, imageUrl, description, brand } = req.body;

      try {
        await Shoes.create({
          name,
          price,
          imageUrl,
          description,
          brand,
          creator: req.user._id,
          buyers: [],
        });

        res.status(201).redirect("/shoes/all");
      } catch (error) {
        const errors = handleErrors(error);
        console.log(errors);
        res.render("shoes/create", {
          oldInput: { ...req.body },
          message: Object.values(errors).slice(0, 1),
        });
      }
    },
  },
  put: {
    async edit(req, res, next) {
      const { id } = req.params;
      const { name, price, imageUrl, description, brand } = req.body;

      try {
        if (!name || !price || !imageUrl || !description || !brand) {
          throw new Error("Please fill all the fileds.");
        }
        await Shoes.updateOne(
          { _id: id },
          { name, price, imageUrl, description, brand }
        );
        res.redirect(`/shoes/details/${id}`);
      } catch (error) {
        res.render("shoes/edit", {
          _id: req.params.id,
          ...req.body,
          message: error.message,
        });
      }
    },
    async buy(req, res, next) {
      const { id } = req.params;

      try {
        await Shoes.updateOne(
          { _id: id },
          { $push: { buyers: req.user.email } }
        );
        await User.updateOne(
          { _id: req.user._id },
          { $push: { offersBought: id } }
        );
        res.redirect(`/shoes/details/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
  },
  delete: {
    async remove(req, res, next) {
      const { id } = req.params;

      try {
        await Shoes.deleteOne({ _id: id });
        // await User.updateOne(
        //   { _id: req.user_.id },
        //   { $pull: { offersBought: id } }
        // );
        res.redirect("/shoes/all");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
