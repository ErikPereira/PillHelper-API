/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const pathFs = "./src/Python/ImagesForTestIA";
const fs = require("fs");

const imageNames = fs
  .readdirSync(pathFs)
  .filter(entry => entry.endsWith(".jpg"));

module.exports = {
  imageNames,
};