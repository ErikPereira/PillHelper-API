/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
// const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const { encode } = require("js-base64");
const mongoUserController = require("./mongo/mongoUser-controller");

async function getAllUser() {
  try {
    const result = await mongoUserController.getAllUser();
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
    const result = await mongoUserController.getLoginUser();
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
    console.log(`[pillhelper-collector.checkLoginUser] ${err.msgError}`);
    throw err;
  }
}

async function insertOneUser(credentials) {
  // check if login recive is valide
  try {
    await checkLoginUser(credentials);
    return {
      status: StatusCodes.CONFLICT,
      error: true,
      msgError: "email ou celular já cadastrado",
      response: {},
    };
  } catch (err) {
    console.log("Login disponivel");
  }

  // insert a new user in Mongobd, collection: User
  try {
    const result = await mongoUserController.insertOneUser(credentials);
    return {
      status: StatusCodes.CREATED,
      error: false,
      msgError: "",
      response: result.uuid,
    };
  } catch (err) {
    console.log(`[pillhelper-collector.checkLoginUser] ${err.msgError}`);
    throw err;
  }
}
module.exports = {
  getAllUser,
  insertOneUser,
  checkLoginUser,
};
