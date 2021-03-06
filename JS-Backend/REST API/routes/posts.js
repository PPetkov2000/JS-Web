const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  async getPosts(req, res) {
    try {
      const posts = await Post.find();
      res.status(200).json({ message: "Fetched posts successfully.", posts });
    } catch {
      res.status(500).json({ message: "Server error!" });
    }
  },
  async getPost(req, res, next) {
    const postId = req.params.id;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        const error = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: "Fetched post succcessfully.", post });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  },
  async createPost(req, res) {
    const { title, description } = req.body;

    try {
      const post = new Post({ title, description, creatorId: req.user });
      const savedPost = await post.save();
      await User.updateOne(
        { _id: req.user },
        { $push: { posts: savedPost._id } }
      );
      res.status(201).json({
        message: "Post created successfully.",
        post: savedPost,
      });
    } catch (error) {
      const errors = handleErrors(error);
      res.json({ errors });
      // if (!error.statusCode) {
      //   error.statusCode = 500;
      // }
      // next(error);
    }
  },
  async editPost(req, res, next) {
    const postId = req.params.id;
    const { title, description } = req.body;

    try {
      // await Post.updateOne({ _id: postId }, { title, description });
      const post = await Post.findById(postId);

      if (!post) {
        const error = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }

      if (post.creatorId.toString() !== req.user) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      post.title = title;
      post.description = description;
      const newPost = await post.save();
      res
        .status(200)
        .json({ message: "Post updated successfully.", post: newPost });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  },
  async removePost(req, res, next) {
    const postId = req.params.id;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        const error = new Error("Post not found!");
        error.statusCode = 404;
        throw error;
      }

      await Post.deleteOne({ _id: postId });
      await User.updateOne({ _id: req.user }, { $pull: { posts: postId } });
      res.status(200).json({ message: "Post removed successfully." });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  },
};

function handleErrors(error) {
  const errors = Object.values(error.errors).reduce((acc, { properties }) => {
    acc[properties.path] = properties.message;
    return acc;
  }, {});
  return errors;
}
