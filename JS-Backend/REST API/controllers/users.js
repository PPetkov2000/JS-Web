const jwt = require("jsonwebtoken");
const { secret } = require("../config/config").development;
const User = require("../models/User");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  async getUser(req, res, next) {
    const userId = req.params.id;

    try {
      const user = await User.findById(userId).populate("posts");

      if (!user) {
        res.status(404);
        throw new Error("User not found!");
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  async registerUser(req, res, next) {
    const { username, password, repeatPassword } = req.body;

    try {
      if (password !== repeatPassword) {
        res.status(400);
        throw new Error("Passwords do not match!");
      }

      const dbUser = await User.findOne({ username });

      if (dbUser) {
        res.status(400);
        throw new Error("This username is already taken.");
      }

      const user = await User.create({ username, password });

      if (!user) {
        res.status(400);
        throw new Error("Invalid user data.");
      }

      res.status(201).json({ message: "User successfully registered!" });
    } catch (error) {
      next(error);
    }
  },
  async loginUser(req, res, next) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user || !(await user.passwordsMatch(password))) {
        res.status(401);
        throw new Error("Invalid email or password");
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
      });
    } catch (error) {
      next(error);
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
