const mongoose = require("mongoose");
const { dbUrl } = require("./config").development;

module.exports = () => {
  return mongoose.connect(
    dbUrl,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    console.log("Database is setup and running!")
  );
};
