const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: [5, "Post title should be atleast 5 characters long."],
    required: [true, "Title is required."],
  },
  description: {
    type: String,
    minlength: [10, "Post description should be atleast 10 characters long."],
    required: [true, "Description is required."],
  },
  creatorId: {
    type: "ObjectId",
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
