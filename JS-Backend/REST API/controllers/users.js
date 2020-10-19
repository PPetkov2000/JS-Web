const jwt = require("jsonwebtoken");
const { secret } = require("../config/config").development;
const User = require("../models/User");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res
        .status(200)
        .json({ message: "Fetched users successfully", users, success: true });
    } catch {
      res.status(500).json({ message: "Server error!", success: false });
    }
  },
  async getUser(req, res, next) {
    const userId = req.params.id;

    try {
      const user = await User.findById(userId).populate("posts");

      if (!user) {
        const error = new Error("User not found!");
        error.statusCode = 404;
        throw error;
      }

      res
        .status(200)
        .json({ message: "Fetched user successfully", user, success: true });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  },
  async registerUser(req, res) {
    const { username, password, repeatPassword } = req.body;

    try {
      if (
        username == null ||
        username === "" ||
        password == null ||
        password === "" ||
        repeatPassword == null ||
        repeatPassword === ""
      ) {
        const error = new Error("Please fill in the fields.");
        error.statusCode = 400;
        throw error;
      }

      if (password !== repeatPassword) {
        const error = new Error("Passwords do not match!");
        error.statusCode = 400;
        throw error;
      }

      const dbUser = await User.findOne({ username });

      if (dbUser) {
        const error = new Error("This username is already taken.");
        error.statusCode = 400;
        throw error;
      }

      await User.create({ username, password });
      res
        .status(201)
        .json({ message: "User successfully registered!", success: true });
    } catch (err) {
      if (err.statusCode < 500) {
        return res.json({ message: err.message, success: false });
      }
      res.status(500).json({ message: "Server error!", success: false });
    }
  },
  async loginUser(req, res) {
    const { username, password } = req.body;

    try {
      if (
        username == null ||
        username === "" ||
        password == null ||
        password === ""
      ) {
        const error = new Error("Please fill in the fields.");
        error.statusCode = 400;
        throw error;
      }

      const user = await User.findOne({ username });

      if (!user) {
        const error = new Error("User not found!");
        error.statusCode = 404;
        throw error;
      }

      const passwordsMatch = await user.passwordsMatch(password);

      if (!passwordsMatch) {
        const error = new Error("Incorrect password!");
        error.statusCode = 400;
        throw error;
      }

      const token = jwt.sign(
        {
          userId: user._id.toString(),
          username: user.username,
        },
        secret,
        { expiresIn: "1h" }
      );

      res.cookie("auth-token", token, { maxAge: 3600000 }).status(200).json({
        message: "User successfully logged in!",
        userId: user._id.toString(),
        token,
        success: true,
      });
    } catch (err) {
      if (err.statusCode < 500) {
        return res.json({ message: err.message, success: false });
      }
      res.status(500).json({ message: "Server error!", success: false });
    }
  },
  logoutUser(req, res) {
    // Not working on 100%
    req.user = null;
    res.clearCookie("auth-token");
    // res
    //   .cookie("auth-token", "", {
    //     expiresIn: new Date(0),
    //     domain: "localhost",
    //     path: "/",
    //   })
    //   .status(200)
    //   .json({ message: "Successfully logged out!", success: true });
  },
};
