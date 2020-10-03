const mongoose = require("mongoose");

const accessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    match: [/[a-z0-9\s]*/gi, "Please fill a valid accessory name"],
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    match: [/[a-z0-9\s]*/gi, "Please fill a valid description"],
  },
  imageUrl: {
    type: String,
    required: true,
    match: [/(http:\/\/|https:\/\/).+/, "Please fill a valid image url"],
  },
  cubes: [
    {
      type: "ObjectId",
      ref: "Cube",
    },
  ],
});

module.exports = mongoose.model("Accessory", accessorySchema);
