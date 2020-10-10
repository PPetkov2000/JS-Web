const express = require("express");
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const { select } = require("../helpers/hbs");

module.exports = (app) => {
  app.engine(
    "hbs",
    handlebars({
      helpers: { select },
      layoutsDir: "views",
      defaultLayout: "base-layout",
      partialsDir: "views/partials",
      extname: "hbs",
    })
  );
  app.set("view engine", "hbs");
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("static"));
  app.use(cookieParser());
  app.use(methodOverride("_method"));
};
