/* eslint-disable import/no-extraneous-dependencies */
const path = {
  test: ".env.test",
  dev: ".env.dev",
};

module.exports =
  process.env.NODE_ENV && path[process.env.NODE_ENV]
    ? require("dotenv").config({ path: path[process.env.NODE_ENV] })
    : require("dotenv").config({ path: path.test });
