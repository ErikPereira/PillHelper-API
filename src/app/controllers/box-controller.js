/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
// const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const { encode } = require("js-base64");
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

async function checkLoginUser(credentials) {
  try {
    const result = await mongoBoxController.getLoginUser();
    const check = result.find(
      user =>
        user.login.password === encode(credentials.password) &&
        (user.login.cell === credentials.cell ||
          user.login.email === credentials.email)
    );

    if (check === undefined) {
      const err = {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: `User Not Found`,
        response: {},
      };
      throw err;
    }

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: check.uuid,
    };
  } catch (err) {
    console.log(`[pillhelper-collector.checkLoginUser] ${err.msgError}`);
    throw err;
  }
}

async function insertOneUser(credentials) {
  // check if login recive is valide
  try {
    await checkLoginUser(credentials);
    return {
      status: StatusCodes.CONFLICT,
      error: true,
      msgError: "email ou celular já cadastrado",
      response: {},
    };
  } catch (err) {
    console.log("Login disponivel");
  }

  // insert a new user in Mongobd, collection: User
  try {
    const result = await mongoBoxController.insertOneUser(credentials);
    return {
      status: StatusCodes.CREATED,
      error: false,
      msgError: "",
      response: result.uuid,
    };
  } catch (err) {
    console.log(`[pillhelper-collector.insertOneUser] ${err.msgError}`);
    throw err;
  }
}

async function createAlarmUser(uuid, newAlarm) {
  try {
    const user = await mongoBoxController.getOneUser(uuid);
    user.alarms.push({ ...newAlarm, uuidAlarm: uuidv4() });

    await mongoBoxController.updateUser(user);

    return {
      status: StatusCodes.CREATED,
      error: false,
      msgError: "",
      response: "Alarm created",
    };
  } catch (err) {
    console.log(`[pillhelper-collector.createAlarmUser] ${err.msgError}`);
    throw err;
  }
}

async function deleteAlarmUser(uuidUser, uuidAlarm) {
  try {
    const user = await mongoBoxController.getOneUser(uuidUser);

    user.alarms = user.alarms.filter(alarm => {
      return alarm.uuidAlarm !== uuidAlarm;
    });

    await mongoBoxController.updateUser(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Alarme Deleted",
    };
  } catch (err) {
    console.log(`[pillhelper-collector.deleteAlarmUser] ${err.msgError}`);
    throw err;
  }
}

async function updateAlarmUser(uuid, updateAlarm) {
  try {
    const user = await mongoBoxController.getOneUser(uuid);

    user.alarms = user.alarms.map(alarm => {
      return alarm.uuidAlarm === updateAlarm.uuidAlarm ? updateAlarm : alarm;
    });

    await mongoBoxController.updateUser(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Alarme Updated",
    };
  } catch (err) {
    console.log(`[pillhelper-collector.updateAlarmUser] ${err.msgError}`);
    throw err;
  }
}

module.exports = {
  updateAlarmUser,
  createAlarmUser,
  deleteAlarmUser,
  checkLoginUser,
  insertOneUser,
  getAllBox,
};
