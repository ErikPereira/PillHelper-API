/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const _ = require("lodash"); 
const { StatusCodes } = require("http-status-codes");
const pythonTextRecognizerServices = require("../services/python-textRecognizer-services");
const { imageNames } = require("../utils/getImagesName");

async function textRecognizer(body) {
  try {
    const testResult = [];
    await imageNames.forEach(async name => {
      try {  
        const result = await pythonTextRecognizerServices.getImageString(name);
        testResult.push({
          image: name,
          error: false,
          msgError: "",
          response: result,
        });
      } catch (err){
        testResult.push({
          image: name,
          error: true,
          msgError: err.msgError,
          response: "",
        });
      }
    });
    
    console.log(testResult);
    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: testResult,
    };
  } catch (err) {
    console.log(`[python-controller.textRecognizer] ${err.msgError}`);
    throw err;
  }
}

module.exports = {
  textRecognizer,
};
