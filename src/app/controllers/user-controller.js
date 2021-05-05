/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
// const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const { encode } = require("js-base64");
const mongoController = require("./mongo/mongo-controller");

async function getAllUser() {
  try {
    const result = await mongoController.getAllUser();
    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: result,
    };
  } catch (err) {
    console.log(`[pillhelper-collector.getAllUser] ${err.msgError}`);
    throw err;
  }
}

async function checkLoginUser(credentials) {
  try {
    const result = await mongoController.getLoginUser();
    const check = result.find(
      user =>
        user.login.password === encode(credentials.password) &&
        (user.login.cell === credentials.cell ||
          user.login.email === credentials.email)
    );

    if (check === undefined) {
      const err = {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: `User Not Found`,
        response: {},
      };
      throw err;
    }

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: check.uuid,
    };
  } catch (err) {
    console.log(`[pillhelper-collector.checkLoginUser] ${err.msg}`);
    throw err;
  }
}
module.exports = {
  getAllUser,
  checkLoginUser,
};
