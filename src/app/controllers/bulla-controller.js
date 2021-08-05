const { StatusCodes } = require("http-status-codes");
const mongoBullaController = require("./mongo/mongoBullar-controller");
const mongoUserController = require("./mongo/mongoUser-controller");
const mongoSupervisorController = require("./mongo/mongoSupervisor-controller");
const utils = require("../utils/pillhelper-utils");

async function checkIsUserOrSupervisor(uuid) {
    const people = {
      who: "user",
      obj: {},
    };
    try {
      people.obj = await mongoUserController.getOneUser(uuid);
    } catch (err) {
      try {
        people.obj = await mongoSupervisorController.getOneSupervisor(uuid);
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
    return people;
}

function checkBullaAlreadyRegistered(nameBulla, obj){
    try{
        const find = obj.bulla.find( 
            bulla => nameBulla === bulla.nameBulla
        );
        return !!find;
    }catch (err) {
        const res = utils.checkError(err);
        console.log(`[bulla-controller.checkBullaAlreadyRegistered] ${res.msgError}`);
        throw err;
    }
}

async  function removeBulla(body){
    try {
        const { uuid, nameBulla } = body
        const people = await checkIsUserOrSupervisor(uuid);
        if(!checkBullaAlreadyRegistered(nameBulla, people.obj)){
            return {
                status: StatusCodes.OK,
                error: false,
                msgError: "",
                response: "Bula já não estava cadastrada",
            };
        }
        
        people.obj.bulla = people.obj.bulla.filter(bulla => {
            return bulla.nameBulla.toLowerCase() !== nameBulla.toLowerCase();
          });

        if (people.who === "user") {
            await mongoUserController.updateUser(people.obj);
        } else {
            await mongoSupervisorController.updateSupervisor(people.obj);
        }

        return {
            status: StatusCodes.OK,
            error: false,
            msgError: "",
            response: `Bula ${nameBulla} removida`,
        };
    } catch (err) {
        console.log(`[bulla-controllerr.removeBulla] ${err.msgError}`);
        throw err;
    }
}

module.exports = {
    checkBullaAlreadyRegistered,
    checkIsUserOrSupervisor,
    removeBulla,
};
