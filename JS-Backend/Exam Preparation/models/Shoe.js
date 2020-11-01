const mongoose = require("mongoose");

const shoesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name."],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Please enter a price."],
    min: [0, "Minimum price is 0."],
  },
  imageUrl: {
    type: String,
    required: [true, "Please enter a imageUrl."],
  },
  description: {
    type: String,
    required: [true, "Please enter a decription."],
  },
  brand: {
    type: String,
    required: [true, "Please enter a brand."],
  },
  createdAt: {
    type: String,
    required: true,
    default: Date.now(),
  },
  creator: {
    type: "ObjectId",
    ref: "User",
  },
  buyers: {
    type: [String],
  },
});

module.exports = mongoose.model("Shoes", shoesSchema);
