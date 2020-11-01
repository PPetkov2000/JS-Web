const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = {
  generateToken(user) {
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      secret,
      { expiresIn: "1h" }
    );

    return token;
  },
  verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
        return;
      });
    });
  },
};
