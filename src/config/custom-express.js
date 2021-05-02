const express = require("express");
require("./env-config");
const routes = require("../app/routes/routes");
const authMiddleware = require("../app/middleware/auth");

const app = express();

app.use(authMiddleware.verifyJWT);

routes(app);

module.exports = app;
