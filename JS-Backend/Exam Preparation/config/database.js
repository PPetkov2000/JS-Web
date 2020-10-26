const mongoose = require("mongoose");
const dbConnectionString = require("./").dbUrl;

module.exports = () => {
  return mongoose.connect(
    dbConnectionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    console.log("Database is setup and running!")
  );
};
