const jwt = require("jsonwebtoken");
const { secret, cookie } = require("../config/config").development;

module.exports = () => {
  return async function (req, res, next) {
    // const authCookie = req.cookies[cookie];
    // if (!authCookie) {
    //   return res.status(401).json({ message: "Not authenticated!" });
    // }

    const authHeaders = req.get("Authorization");

    if (!authHeaders) {
      return res.status(401).json({ message: "Not authenticated!" });
    }

    const token = authHeaders.split(" ")[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, secret);
    } catch (error) {
      return res.status(401).json({ message: "Token is invalid.", error });
    }

    req.user = { _id: decodedToken.userId };
    next();
  };
};
