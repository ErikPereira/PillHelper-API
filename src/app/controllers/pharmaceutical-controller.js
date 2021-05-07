/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const { StatusCodes } = require("http-status-codes");
const { encode } = require("js-base64");
const mongoPharmaceuticalController = require("./mongo/mongoPharmaceutical-controller");
const mongoUserController = require("./mongo/mongoUser-controller");

async function getAllPharmaceutical() {
  try {
    const result = await mongoPharmaceuticalController.getAllPharmaceutical();
    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: result,
    };
  } catch (err) {
    console.log(
      `[Pharmaceutical-controller.getAllPharmaceutical] ${err.msgError}`
    );
    throw err;
  }
}

async function checkLoginPharmaceutical(credentials) {
  try {
    const result = await mongoPharmaceuticalController.getLoginPharmaceutical();
    const check = result.find(
      phar =>
        phar.login.password === encode(credentials.password) &&
        (phar.login.cell === credentials.cell ||
          phar.login.email === credentials.email)
    );

    if (check === undefined) {
      const err = {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: `Pharmaceutical Not Found`,
        response: {},
      };
      throw err;
    }

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: check.uuidPhar,
    };
  } catch (err) {
    console.log(`[user-controller.checkLoginPharmaceutical] ${err.msgError}`);
    throw err;
  }
}

async function insertOnePharmaceutical(credentials) {
  // check if login recive is valide
  try {
    await checkLoginPharmaceutical(credentials);
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
    const result = await mongoPharmaceuticalController.insertOnePharmaceutical(
      credentials
    );
    return {
      status: StatusCodes.CREATED,
      error: false,
      msgError: "",
      response: result.uuidPhar,
    };
  } catch (err) {
    console.log(
      `[Pharmaceutical-controller.insertOnePharmaceutical] ${err.msgError}`
    );
    throw err;
  }
}

async function updatePharmaceutical(upPharmaceutical) {
  try {
    await mongoPharmaceuticalController.updatePharmaceutical(upPharmaceutical);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Pharmaceutical Updated",
    };
  } catch (err) {
    console.log(
      `[Pharmaceutical-controller.updatePharmaceutical] ${err.msgError}`
    );
    throw err;
  }
}

async function registerUser(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);
    const phar = await mongoPharmaceuticalController.getOnePharmaceutical(
      body.uuidPhar
    );

    if (
      phar.users.find(u => {
        return u.uuidUser === user.uuid;
      })
    ) {
      return {
        status: StatusCodes.OK,
        error: false,
        msgError: "",
        response: "this User is already in the Pharmaceutical",
      };
    }

    phar.users.push({ uuidUser: user.uuid });

    await mongoPharmaceuticalController.updatePharmaceutical(phar);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "User registerd successfully",
    };
  } catch (err) {
    console.log(`[pharmaceutical-controller.registerUser] ${err.msgError}`);
    throw err;
  }
}

module.exports = {
  checkLoginPharmaceutical,
  insertOnePharmaceutical,
  getAllPharmaceutical,
  updatePharmaceutical,
  registerUser,
};
