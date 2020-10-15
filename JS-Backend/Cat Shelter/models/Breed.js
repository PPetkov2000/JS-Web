const mongoose = require("mongoose");

const breedsSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Breed", breedsSchema);
