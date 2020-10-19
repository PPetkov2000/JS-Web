module.exports = {
  development: {
    port: process.env.PORT || 8000,
    dbUrl: process.env.DB_URL,
    secret: process.env.JWT_SECRET,
    cookie: process.env.JWT_AUTH_COOKIE,
  },
  production: {},
};
