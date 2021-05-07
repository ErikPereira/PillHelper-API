/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const { StatusCodes } = require("http-status-codes");
const { encode } = require("js-base64");
const mongoPharmaceuticalController = require("./mongo/mongoPharmaceutical-controller");

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

async function deleteOnePharmaceutical(uuidPhar) {
  try {
    const result = await mongoPharmaceuticalController.deleteOnePharmaceutical(
      uuidPhar
    );
    console.log(result);
    return {
      status: StatusCodes.ok,
      error: false,
      msgError: "",
      response: "Pharmaceutical deleted",
    };
  } catch (err) {
    console.log(
      `[Pharmaceutical-controller.deleteOnePharmaceutical] ${err.msgError}`
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

module.exports = {
  checkLoginPharmaceutical,
  deleteOnePharmaceutical,
  insertOnePharmaceutical,
  getAllPharmaceutical,
  updatePharmaceutical,
};
