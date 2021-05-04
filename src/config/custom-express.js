const express = require("express");
require("./env-config");
const routes = require("../app/routes/routes");
const authMiddleware = require("../app/middleware/auth");

const app = express();

app.use(authMiddleware.verifyJWT);

app.use(
  express.urlencoded({
    extended: true,
  })
);

routes(app);

module.exports = app;
