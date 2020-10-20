module.exports = function (error) {
  const errors = Object.values(error.errors).reduce((acc, { properties }) => {
    acc[properties.path] = properties.message;
    return acc;
  }, {});
  return errors;
};
