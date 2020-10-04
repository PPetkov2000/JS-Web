const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret, cookie } = require("../config/config").development;
const User = require("../models/User");

module.exports = {
  registerPage(req, res) {
    if (req.user != null) {
      return res.redirect("/");
    }
    res.render("user/register");
  },
  loginPage(req, res) {
    if (req.user != null) {
      return res.redirect("/");
    }
    res.render("user/login");
  },
  logoutUser(req, res) {
    req.user = null;
    res.clearCookie(cookie).redirect("/user/login");
  },
  async registerUser(req, res) {
    const { username, password, repeatPassword } = req.body;

    if (password !== repeatPassword) {
      return res.render("user/register", {
        error: "Passwords do not match!",
      });
    }

    if (
      !username ||
      username.length < 5 ||
      !password ||
      password.length < 8 ||
      !password.match(/^[A-Za-z0-9]+$/)
    ) {
      return res.render("user/register", {
        error: "Username or password is not valid",
      });
    }

    try {
      const dbUser = await User.findOne({ username }).lean();

      if (dbUser) {
        return res.render("user/register", {
          error: "User already exists!",
        });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hash });
      await user.save();
      res.status(201).redirect("/user/login");
    } catch (err) {
      console.log(err);
      res.status(500).redirect("/user/register");
    }
  },
  async loginUser(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username }).lean();

      if (!user) {
        return res.render("user/login", {
          error: "Wrong username or password",
        });
      }

      const result = await bcrypt.compare(password, user.password);

      if (!result) {
        return res.render("user/login", {
          error: "Wrong username or password",
        });
      }

      const token = jwt.sign(
        { userId: user._id, username: user.username },
        secret,
        { expiresIn: "1h" }
      );

      return res
        .status(201)
        .cookie(cookie, token, { maxAge: 3600000 })
        .redirect("/");
    } catch (err) {
      console.log(err);
      res.status(500).redirect("/user/login");
    }
  },
};
