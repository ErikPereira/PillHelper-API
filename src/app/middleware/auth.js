const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const config = require("../../config/server-config");
const CollectorResponse = require("../utils/response/CollectorResponse");

// eslint-disable-next-line consistent-return
async function verifyJWT(req, res, next) {
  const numParts = 2; // Bearer + token info
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(new CollectorResponse({ error: "No token provided" }));
  }

  const parts = authHeader.split(" ");

  if (parts.length !== numParts) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(new CollectorResponse({ error: "JWT Token malformatted" }));
  }

  const [, token] = parts;

  try {
    jwt.verify(token, config.secret);
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(new CollectorResponse({ error: "Invalid JWT Token" }));
  }

  return next();
}

module.exports = { verifyJWT };
