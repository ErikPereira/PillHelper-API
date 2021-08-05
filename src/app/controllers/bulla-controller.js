const { StatusCodes } = require("http-status-codes");
const mongoBullaController = require("./mongo/mongoBullar-controller");
const utils = require("../utils/pillhelper-utils");

async function checkBullaAlreadyRegistered(nameBulla, obj){
    try{
        const find = obj.bulla.find( 
            bulla => nameBulla === bulla.nameBulla
        );
        return {
            status: StatusCodes.OK,
            error: false,
            msgError: "",
            response: !!find,
          };
    }catch (err) {
        const res = utils.checkError(err);
        console.log(`[bulla-controller.checkBullaAlreadyRegistered] ${res.msgError}`);
        throw err;
    }
}

module.exports = {
    checkBullaAlreadyRegistered,
};
