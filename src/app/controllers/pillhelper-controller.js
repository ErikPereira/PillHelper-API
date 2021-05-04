/* eslint-disable no-await-in-loop */
// const _ = require("lodash");
// const mongoController = require("./mongo/mongo-controller");
// const utils = require("../utils/pillhelper-utils");

async function teste(body) {
  try {
    console.log(body);
    return { teste: "oi" };
  } catch (err) {
    console.log(`[pillhelper-collector.getpillhelper] ${err.message}`);
    throw err;
  }
}

module.exports = {
  teste,
};
