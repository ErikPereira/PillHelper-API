/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
// const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
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
    console.log(`[pillhelper-collector.getAllBox] ${err.msgError}`);
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
    console.log(`[pillhelper-collector.insertOneBox] ${err.msgError}`);
    throw err;
  }
}

async function createAlarmBox(uuid, newAlarm) {
  try {
    const user = await mongoBoxController.getOneBox(uuid);
    user.alarms.push({ ...newAlarm, uuidAlarm: uuidv4() });

    await mongoBoxController.updateBox(user);

    return {
      status: StatusCodes.CREATED,
      error: false,
      msgError: "",
      response: "Alarm created",
    };
  } catch (err) {
    console.log(`[pillhelper-collector.createAlarmBox] ${err.msgError}`);
    throw err;
  }
}

async function deleteAlarmBox(uuidBox, uuidAlarm) {
  try {
    const user = await mongoBoxController.getOneBox(uuidBox);

    user.alarms = user.alarms.filter(alarm => {
      return alarm.uuidAlarm !== uuidAlarm;
    });

    await mongoBoxController.updateBox(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Alarme Deleted",
    };
  } catch (err) {
    console.log(`[pillhelper-collector.deleteAlarmBox] ${err.msgError}`);
    throw err;
  }
}

async function updateAlarmBox(uuid, updateAlarm) {
  try {
    const user = await mongoBoxController.getOneBox(uuid);

    user.alarms = user.alarms.map(alarm => {
      return alarm.uuidAlarm === updateAlarm.uuidAlarm ? updateAlarm : alarm;
    });

    await mongoBoxController.updateBox(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Alarme Updated",
    };
  } catch (err) {
    console.log(`[pillhelper-collector.updateAlarmBox] ${err.msgError}`);
    throw err;
  }
}

module.exports = {
  updateAlarmBox,
  createAlarmBox,
  deleteAlarmBox,
  insertOneBox,
  getAllBox,
};
