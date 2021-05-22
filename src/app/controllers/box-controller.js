/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const { StatusCodes } = require("http-status-codes");
const mongoBoxController = require("./mongo/mongoBox-controller");

async function getAllBox() {
  try {
    const result = await mongoBoxController.getAllBox();
    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: result,
    };
  } catch (err) {
    console.log(`[box-controller.getAllBox] ${err.msgError}`);
    throw err;
  }
}

async function getOneBox(uuidBox) {
  try {
    return await mongoBoxController.getOneBox(uuidBox);
  } catch (err) {
    console.log(`[box-controller.getOneBox] ${err.msgError}`);
    throw err;
  }
}

async function insertOneBox() {
  try {
    const result = await mongoBoxController.insertOneBox();
    return {
      status: StatusCodes.CREATED,
      error: false,
      msgError: "",
      response: result.uuidBox,
    };
  } catch (err) {
    console.log(`[box-controller.insertOneBox] ${err.msgError}`);
    throw err;
  }
}

async function deleteOneBox(uuidBox) {
  try {
    const result = await mongoBoxController.deleteOneBox(uuidBox);
    console.log(result);
    return {
      status: StatusCodes.ok,
      error: false,
      msgError: "",
      response: "Box deleted",
    };
  } catch (err) {
    console.log(`[box-controller.deleteOneBox] ${err.msgError}`);
    throw err;
  }
}

async function updateBox(upBox) {
  try {
    await mongoBoxController.updateBox(upBox);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Box Updated",
    };
  } catch (err) {
    console.log(`[box-controller.updateBox] ${err.msgError}`);
    throw err;
  }
}

async function unlinkBox(uuidBox) {
  try {
    const box = await mongoBoxController.getOneBox(uuidBox);
    box.uuidUser = "";
    box.nameBox = "";

    await updateBox(box);
  } catch (err) {
    console.log(`[box-controller.unlinkBox] ${err.msgError}`);
    throw err;
  }
}

module.exports = {
  deleteOneBox,
  insertOneBox,
  getOneBox,
  updateBox,
  getAllBox,
  unlinkBox,
};
