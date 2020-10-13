const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    port: process.env.PORT || 5000,
    dbUrl:
      "mongodb+srv://user:softuni-password@softuni.cpuao.mongodb.net/CatShelter?retryWrites=true&w=majority",
    cookie: "x-auth-token",
    secret: "my-secret",
  },
  production: {},
};

module.exports = config[env];
