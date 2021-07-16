/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const { StatusCodes } = require("http-status-codes");
const pythonTextRecognizerServices = require("../services/python-textRecognizer-services");

async function textRecognizer(body) {
  try {
    console.log(body);
    const result = await pythonTextRecognizerServices.getImageString();
    console.log(result);
    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: result,
    };
  } catch (err) {
    console.log(`[python-controller.textRecognizer] ${err.msgError}`);
    throw err;
  }
}

module.exports = {
  textRecognizer,
};
