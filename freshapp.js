const express = require("express");
const cnn = require("./connection");
const bodyparser = require("body-parser");
const app = express();
const session = require("express-session");
const { request } = require("express");
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);