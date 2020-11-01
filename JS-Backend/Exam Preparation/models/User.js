const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { saltRounds } = require("../config");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "Email should be at least 3 characters long!"],
  },
  fullName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: [3, "Password should be at least 3 characters long!"],
  },
  offersBought: [
    {
      type: "ObjectId",
      ref: "Shoes",
    },
  ],
});

userSchema.methods.passwordsMatch = async function (password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
};

userSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
