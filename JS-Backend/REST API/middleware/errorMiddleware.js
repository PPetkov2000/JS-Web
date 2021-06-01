const handleErrors = require("../utils/errorHandler");

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (error.message.includes("Cast to ObjectId failed")) {
    return res.status(404).json({ message: "Not found!" });
  }
  if (error.message.includes("validation failed")) {
    const errors = handleErrors(error);
    return res.status(400).json({ errors: Object.values(errors) });
  }
  console.log(error.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: error.message });
};

module.exports = { notFound, errorHandler };
