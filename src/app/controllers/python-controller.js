/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const _ = require("lodash"); 
const { StatusCodes } = require("http-status-codes");
const pythonTextRecognizerServices = require("../services/python-textRecognizer-services");
const pythonWebScrapingServices = require("../services/python-webScraping-services");
const mongoBullaController = require("./mongo/mongoBullar-controller");
const userController = require("./user-controller");
const supervisorController = require("./supervisor-controller");
// const { imageNames } = require("../utils/getImagesName");

async function textRecognizer(file, uuid) {
  let people = {
    who: "user",
    obj: {},
  };

  try {
    people.obj = (await userController.getOneUser(uuid)).response;
  } catch (err) {
    try {
      people.obj = (await supervisorController.getOneSupervisorUuid(uuid)).response;
      people.who = "supervisor";
    } catch (err2) {
      const err = {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: `Uuid Not Found`,
        response: {},
      };
      throw err;
    }
  }

  try {
    const namesBulla = await mongoBullaController.getAllNameBulla();

    console.log(`[Log][python.textRecognizer] IA verificando a imagem...`);
    const resultTextRecognizer = await pythonTextRecognizerServices.getImageString(file.destination + file.filename);
    console.log(`[Log][python.textRecognizer] Resultado da IA: "${resultTextRecognizer}"`);

    const find = namesBulla.find( 
      bulla => resultTextRecognizer.includes(bulla.nameBulla)
    );

    if (find === undefined) {
      console.log(`[Log][python.textRecognizer]Bula não encontrada`);
      const err = {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: `Not Found`,
        response: {},
      };
      throw err;
    }

    const bulla = await mongoBullaController.getOneBulla(find.nameBulla);
    let add;
    if (people.who === "user") {
      add = await userController.addBullaUser(people.obj, bulla);
    } else {
      add = await supervisorController.addBullaSupervisor(people.obj, bulla);
    }

    if(add){
      console.log(`[Log][python.textRecognizer] adicionou no banco: `);
      console.log([bulla]);
      return {
        status: StatusCodes.OK,
        error: false,
        msgError: "",
        response: [bulla],
      };
    }
    console.log(`[Log][python.textRecognizer] Bula ${bulla.nameBulla} já cadastrada`);
    return {
      status: StatusCodes.OK,
      error: true,
      msgError: "",
      response: `Bula ${bulla.nameBulla} já cadastrada`,
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
