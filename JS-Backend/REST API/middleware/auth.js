const { cookie } = require("../config/config").development;
const User = require("../models/User");
const createToken = require("../utils/createToken");

async function signup(req, res, next) {
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

    const token = createToken(user);

    return res.cookie(cookie, token, { maxAge: 3600000 }).status(200).json({
      message: "User successfully logged in!",
      userId: user._id.toString(),
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function authenticate(req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.passwordsMatch(password))) {
      res.status(401);
      throw new Error("Invalid email or password.");
    }

    const token = createToken(user);

    return res.cookie(cookie, token, { maxAge: 3600000 }).status(200).json({
      message: "User successfully logged in!",
      userId: user._id.toString(),
      token,
    });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  req.user = null;
  req.session.destroy((err) => {
    res.clearCookie(cookie, { path: "/" });
  });
}

module.exports = {
  authenticate,
  signup,
  logout,
};
