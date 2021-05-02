module.exports = {
  port: process.env.SERVER_PORT,
  secret: process.env.SECRET || "JWTSecretKey",
};
