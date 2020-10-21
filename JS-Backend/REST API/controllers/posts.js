const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  async getPosts(req, res, next) {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  },
  async getPost(req, res, next) {
    const postId = req.params.id;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        res.status(404);
        throw new Error("Post not found!");
      }

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  },
  async createPost(req, res, next) {
    const { title, description } = req.body;

    try {
      const post = new Post({ title, description, creatorId: req.user._id });
      const createdPost = await post.save();
      await User.updateOne(
        { _id: req.user._id },
        { $push: { posts: createdPost._id } }
      );
      res.status(201).json(createdPost);
    } catch (error) {
      next(error);
    }
  },
  async editPost(req, res, next) {
    const postId = req.params.id;
    const { title, description } = req.body;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        res.status(404);
        throw new Error("Post not found!");
      }

      if (post.creatorId.toString() !== req.user._id) {
        res.status(403);
        throw new Error("Not authorized!");
      }

      post.title = title;
      post.description = description;
      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  },
  async removePost(req, res, next) {
    const postId = req.params.id;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        res.status(404);
        throw new Error("Post not found!");
      }

      await Post.deleteOne({ _id: postId });
      await User.updateOne({ _id: req.user._id }, { $pull: { posts: postId } });
      res.status(200).json({ message: "Post removed successfully." });
    } catch (error) {
      next(error);
    }
  },
};
