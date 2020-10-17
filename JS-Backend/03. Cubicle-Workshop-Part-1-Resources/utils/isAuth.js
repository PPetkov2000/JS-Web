const jwt = require("jsonwebtoken");
const { cookie, secret } = require("../config/config").development;
const User = require("../models/User");

module.exports = (justContinue = false) => {
  return function (req, res, next) {
    const token = req.cookies[cookie] || "";

    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        if (justContinue) {
          next();
          return;
        }
        return res.redirect("/user/login");
      }

      User.findById(decodedToken.userId).then((user) => {
        req.user = user;
        res.locals.isLoggedIn = true;
        next();
      });
    });
  };
};
