const mongoose = require("mongoose");
const dbString = require("./config").dbUrl;
const rdyString = "Database is setup and running!";

module.exports = () => {
  return mongoose.connect(
    dbString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    console.log(rdyString)
  );
};
