const jwt = require("jsonwebtoken");
const { secret } = require("../config/config").development;
const User = require("../models/User");

async function validateUserData(req, res, next) {
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

    next();
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

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      secret,
      { expiresIn: "1h" }
    );

    return res
      .cookie("auth-token", token, { maxAge: 3600000 })
      .status(200)
      .json({
        message: "User successfully logged in!",
        userId: user._id.toString(),
      });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authenticate,
  validateUserData,
};
