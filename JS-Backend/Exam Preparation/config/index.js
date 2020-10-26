const env = process.env.NODE.ENV || "development";

const config = {
  development: {
    port: process.env.PORT || 4000,
    dbUrl:
      "mongodb+srv://user:softuni-password@softuni.cpuao.mongodb.net/Shoes?retryWrites=true&w=majority",
    cookie: "x-auth-token",
    secret: "SuperDuperSecret",
    saltRounds: 10,
  },
};

module.exports = config[env];

