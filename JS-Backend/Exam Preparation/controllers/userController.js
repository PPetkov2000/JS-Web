const { cookie } = require("../config");
const { User, Shoes } = require("../models");
const { generateToken } = require("../utils/jwt");

module.exports = {
  get: {
    register(req, res, next) {
      res.render("user/register");
    },
    login(req, res, next) {
      res.render("user/login");
    },
    logout(req, res, next) {
      req.user = null;
      res.clearCookie(cookie).redirect("/user/login");
    },
    async profile(req, res, next) {
      try {
        const user = await User.findById(req.user._id)
          .populate("offersBought")
          .lean();
        const totalProfit = user.offersBought
          .map((x) => x.price)
          .reduce((acc, curr) => acc + curr, 0);
        res.render("user/profile", {
          ...user,
          totalProfit,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  post: {
    async register(req, res, next) {
      const { email, fullName, password, rePassword } = req.body;

      try {
        if (password !== rePassword) {
          throw new Error("Passwords do not match!");
        }

        const user = await User.findOne({ email });

        if (user) {
          throw new Error("This email is already taken!");
        }

        const createdUser = await User.create({ email, fullName, password });
        const token = generateToken(createdUser);

        res.cookie(cookie, token, { maxAge: 3600000 }).redirect("/shoes/all");
      } catch (error) {
        res.render("user/register", {
          oldInput: { ...req.body },
          message: error.message,
        });
      }
    },
    async login(req, res, next) {
      const { email, password } = req.body;

      try {
        const user = await User.findOne({ email });

        if (!user || !(await user.passwordsMatch(password))) {
          throw new Error("Invalid email or password!");
        }

        const token = generateToken(user);

        res.cookie(cookie, token, { maxAge: 3600000 }).redirect("/shoes/all");
      } catch (error) {
        res.render("user/login", {
          oldInput: { ...req.body },
          message: error.message,
        });
      }
    },
  },
};
