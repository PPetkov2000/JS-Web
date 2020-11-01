module.exports = (isAuthNeeded = true) => {
  return function (req, res, next) {
    const isAuthWhenNotNeeded = req.user && !isAuthNeeded;
    const isNotAuthWhenNeeded = !req.user && isAuthNeeded;

    if (isNotAuthWhenNeeded || isAuthWhenNotNeeded) {
      const redirectPage = isNotAuthWhenNeeded ? "/user/login" : "/shoes/all";
      res.redirect(redirectPage);
      return;
    }

    next();
  };
};
