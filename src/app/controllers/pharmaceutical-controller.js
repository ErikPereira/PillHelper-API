/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const { StatusCodes } = require("http-status-codes");
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

async function insertOnePharmaceutical() {
  try {
    const result = await mongoPharmaceuticalController.insertOnePharmaceutical();
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
  updatePharmaceutical,
  deleteOnePharmaceutical,
  insertOnePharmaceutical,
  getAllPharmaceutical,
};
