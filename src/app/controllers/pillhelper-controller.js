/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
// const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const mongoController = require("./mongo/mongo-controller");

async function getAllUser() {
  try {
    const result = await mongoController.getAllUser();
    return {
      status: StatusCodes.OK,
      error: false,
      response: result,
    };
  } catch (err) {
    console.log(`[pillhelper-collector.getAllUser] ${err.msg}`);
    throw err;
  }
}

module.exports = {
  getAllUser,
};
