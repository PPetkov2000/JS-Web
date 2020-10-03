const mongoose = require("mongoose");
const dbUrl = require("./config").development.dbUrl;
const rdyMsg = "Database is setup and running!";

module.exports = () => {
  return mongoose.connect(
    dbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    console.log(rdyMsg)
  );
};
