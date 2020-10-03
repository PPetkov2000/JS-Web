const mongoose = require("mongoose");

const cubeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    match: [/[a-z0-9\s]*/gi, "Please fill a valid cube name"],
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
  difficultyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  accessories: [
    {
      type: "ObjectId",
      ref: "Accessory",
    },
  ],
  creatorId: {
    type: "ObjectId",
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Cube", cubeSchema);
