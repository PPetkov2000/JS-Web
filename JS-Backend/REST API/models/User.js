const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a username."],
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
  },
  posts: [
    {
      type: "ObjectId",
      ref: "Post",
    },
  ],
});

userSchema.methods.passwordsMatch = async function (password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
};

userSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
