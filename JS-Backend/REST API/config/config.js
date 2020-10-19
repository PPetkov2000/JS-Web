module.exports = {
  development: {
    port: process.env.PORT || 8000,
    dbUrl:
      process.env.DB_URL ||
      "mongodb+srv://user:softuni-password@softuni.cpuao.mongodb.net/REST_API?retryWrites=true&w=majority",
    secret: process.env.JWT_SECRET || "my_secret",
    cookie: process.env.JWT_AUTH_COOKIE || "x-auth-token",
  },
  production: {},
};
