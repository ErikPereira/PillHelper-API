/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const _ = require("lodash"); 
const { StatusCodes } = require("http-status-codes");
const pythonTextRecognizerServices = require("../services/python-textRecognizer-services");
const pythonWebScrapingServices = require("../services/python-webScraping-services");
const { imageNames } = require("../utils/getImagesName");
const mongoBullaController = require("./mongo/mongoBullar-controller");

async function textRecognizer(file) {
  try {
    const namesBulla = await mongoBullaController.getAllNameBulla();
    const resultTextRecognizer = await pythonTextRecognizerServices.getImageString(file.destination + file.filename);
    
    const find = namesBulla.find( 
      bulla => resultTextRecognizer.includes(bulla.nameBulla)
    );

    if (find === undefined) {
      const err = {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: `Not Found`,
        response: {},
      };
      throw err;
    }

    const bulla = await mongoBullaController.getOneBulla(find.nameBulla)
    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: bulla,
    };
  } catch (err) {
    console.log(`[python-controller.textRecognizer] ${err.msgError}`);
    throw err;
  }
}

async function webScraping(body){
  try {
    let start = 1;
    let end = 54;

    if(!body.allPage){
      start = body.start;
      end = body.end;
    }

    for(let i = start; i <= end; i += 1){
      let url = body.url;
    
      if(i === 0)
        continue;
        
      if(i !== 1)
        url = url + `/${i}`;

      try{
        const result = await pythonWebScrapingServices.getWebInformation(url);
        await mongoBullaController.insertManyBulla(result);
        console.log(`Pagina ${i} sucesso, url: ${url}\n\n`);
      } catch (err) {
        console.log(`\n\nErro ao tentar buscar informação na pagina ${i}, url: ${url}\n\n`);
      }
    }

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Bula API populado com sucesso",
    };
  } catch (err) {
    console.log(`[python-controller.webScraping] ${err.msgError}`);
    throw err;
  }
}
module.exports = {
  textRecognizer,
  webScraping,
};
