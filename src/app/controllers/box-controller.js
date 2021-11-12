/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const { StatusCodes } = require("http-status-codes");
const mongoUserController = require("./mongo/mongoUser-controller");
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

async function getAlarms(body) {
  try {
    const { uuidBox} = body;
    const box = await mongoBoxController.getOneBox(uuidBox);

    if(box.uuidUser === ""){
      const err = {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: `Caixa nao possui usuario cadastrado`,
        response: {},
      };
      throw err;
    }

    const user = await mongoUserController.getOneUser(box.uuidUser);
    const { alarms } = user;
    const week = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const result = {
      alarms: [],
    };

    for(let i=0; i < alarms.length; i++){
      const alarm = alarms[i];
      
      if(alarm.active !== "1")
        continue

      if(alarm.alarm_type === "1"){ // fixo
          for(var j = 0; j < 7; j++){
              if(alarm[week[j]] === "1"){
                  let hour = parseInt(alarm.hour)  < 10 ? `0${alarm.hour}`   : alarm.hour % 24;
                  let min = parseInt(alarm.minute) < 10 ? `0${alarm.minute}` : alarm.minute;
                  let posBox = parseInt(alarm.posBox) < 10 ? `0${alarm.posBox}` : alarm.posBox;
                  
                  if(min >= 60){
                      hour = (hour + 1) % 24;
                      min %= 60;
                  }

                  if(alarm.luminous === "0") {
                      posBox = `00`;
                  }

                  result.alarms.push(`WH${j} ${hour}:${min} L${posBox} S${alarm.sound}`);
              }
          }
      }
      else{ // intervalado
          const { times_day }  = alarm;
          let hour, min;

          for(var j = 0; j < times_day; j++){
              hour = ( parseInt(alarm.hour) + (j * parseInt(alarm.period_hour)) ) % 24; 
              min = parseInt(alarm.minute) + (j * parseInt(alarm.period_min));
              
              if(min >= 60){
                  hour = (hour + 1) % 24;
                  min %= 60;
              }

              hour = hour < 10 ? `0${hour}` : hour;
              min = min < 10 ? `0${min}` : min;
              let posBox = parseInt(alarm.posBox) < 10 ? `0${alarm.posBox}` : alarm.posBox;
              
              if(alarm.luminous === "0") {
                  posBox = `00`;
              }

              result.alarms.push(`DH${hour}:${min} L${posBox} S${alarm.sound}`);
          }
      }
    }
    console.log(result)
    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: result,
    };
  } catch (err) {
    console.log(`[box-controller.getAlarms] ${err.msgError}`);
    throw err;
  }
}

module.exports = {
  deleteOneBox,
  insertOneBox,
  getOneBox,
  getAlarms,
  updateBox,
  getAllBox,
  unlinkBox,
};
