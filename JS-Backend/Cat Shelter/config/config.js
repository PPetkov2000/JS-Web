module.exports = {
  development: {
    dbUrl:
      "mongodb+srv://user:softuni-password@softuni.cpuao.mongodb.net/Cubes?retryWrites=true&w=majority",
    secret: "my_secret",
    cookie: "x-auth-token",
    port: process.env.PORT || 3000,
  },
  production: {},
};
