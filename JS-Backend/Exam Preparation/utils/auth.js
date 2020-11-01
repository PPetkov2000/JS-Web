const { cookie } = require("../config");
const { User } = require("../models");
const { verifyToken } = require("./jwt");

module.exports = async function (req, res, next) {
  const token = req.cookies[cookie] || "";

  if (!token) {
    next();
    return;
  }

  try {
    const decodedToken = await verifyToken(token);
    const user = await User.findById(decodedToken.userId).select("-password");
    req.user = user;
    res.locals.isLoggedIn = !!user;
    res.locals.fullName = user.fullName;
    next();
  } catch (error) {
    next(error);
  }
};
