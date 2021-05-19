/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
// const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const { encode } = require("js-base64");
const { v4: uuidv4 } = require("uuid");
const mongoUserController = require("./mongo/mongoUser-controller");
const mongoBoxController = require("./mongo/mongoBox-controller");
const mongoPharmaceuticalController = require("./mongo/mongoPharmaceutical-controller");

async function getAllUser() {
  try {
    const result = await mongoUserController.getAllUser();
    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: result,
    };
  } catch (err) {
    console.log(`[user-controller.getAllUser] ${err.msgError}`);
    throw err;
  }
}

async function getOneUser(uuid) {
  try {
    const result = await mongoUserController.getOneUser(uuid);
    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: result,
    };
  } catch (err) {
    console.log(`[user-controller.getOneUser] ${err.msgError}`);
    throw err;
  }
}

async function checkLoginUser(credentials) {
  try {
    const result = await mongoUserController.getLoginUser();
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
    console.log(`[user-controller.checkLoginUser] ${err.msgError}`);
    throw err;
  }
}

async function insertOneUser(credentials) {
  // check if login recive is valide
  try {
    await checkLoginUser(credentials.login);
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
    const result = await mongoUserController.insertOneUser(credentials);
    return {
      status: StatusCodes.CREATED,
      error: false,
      msgError: "",
      response: result.uuid,
    };
  } catch (err) {
    console.log(`[user-controller.insertOneUser] ${err.msgError}`);
    throw err;
  }
}

async function createAlarmUser(uuid, newAlarm) {
  try {
    const user = await mongoUserController.getOneUser(uuid);
    user.alarms.push({ ...newAlarm, uuidAlarm: uuidv4() });

    await mongoUserController.updateUser(user);

    return {
      status: StatusCodes.CREATED,
      error: false,
      msgError: "",
      response: "Alarm created",
    };
  } catch (err) {
    console.log(`[user-controller.createAlarmUser] ${err.msgError}`);
    throw err;
  }
}

async function deleteAlarmUser(uuidUser, uuidAlarm) {
  try {
    const user = await mongoUserController.getOneUser(uuidUser);

    user.alarms = user.alarms.filter(alarm => {
      return alarm.uuidAlarm !== uuidAlarm;
    });

    await mongoUserController.updateUser(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Alarme Deleted",
    };
  } catch (err) {
    console.log(`[user-controller.deleteAlarmUser] ${err.msgError}`);
    throw err;
  }
}

async function updateAlarmUser(uuid, updateAlarm) {
  try {
    const user = await mongoUserController.getOneUser(uuid);

    user.alarms = user.alarms.map(alarm => {
      return alarm.uuidAlarm === updateAlarm.uuidAlarm ? updateAlarm : alarm;
    });

    await mongoUserController.updateUser(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Alarme Updated",
    };
  } catch (err) {
    console.log(`[user-controller.updateAlarmUser] ${err.msgError}`);
    throw err;
  }
}

async function removeBoxInOldUser(box) {
  try {
    if (box.uuidUser !== "") {
      const oldUser = await mongoUserController.getOneUser(box.uuidUser);
      oldUser.box = oldUser.box.filter(b => {
        return b.uuidBox !== box.uuidBox;
      });
      await mongoUserController.updateUser(oldUser);
    }
  } catch (err) {
    if (err.msgError !== "Not Found - User") {
      throw err;
    }
    console.log(`[user-controller.removeBoxInOldUSer] ${err.msgError}`);
  }
}

async function registerBox(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);
    const box = await mongoBoxController.getOneBox(body.uuidBox);

    if (box.uuidUser === body.uuidUser) {
      return {
        status: StatusCodes.OK,
        error: false,
        msgError: "",
        response: "this box is already in the user",
      };
    }

    box.nameBox = body.nameBox || box.nameBox;

    await removeBoxInOldUser(box);

    box.uuidUser = user.uuid;
    user.box.push({
      uuidBox: box.uuidBox,
      nameBox: box.nameBox,
    });

    await mongoUserController.updateUser(user);
    await mongoBoxController.updateBox(box);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Box registerd successfully",
    };
  } catch (err) {
    console.log(`[user-controller.registerBox] ${err.msgError}`);
    throw err;
  }
}

async function registerPharmaceutical(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);
    const phar = await mongoPharmaceuticalController.getOnePharmaceutical(
      body.uuidPhar
    );

    if (
      user.pharmaceuticals.find(p => {
        return p.uuidPhar === phar.uuidPhar;
      })
    ) {
      return {
        status: StatusCodes.OK,
        error: false,
        msgError: "",
        response: "this Pharmaceutical is already in the User",
      };
    }

    user.pharmaceuticals.push({ uuidPhar: phar.uuidPhar });

    await mongoUserController.updateUser(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Pharmaceuticals registerd successfully",
    };
  } catch (err) {
    console.log(`[user-controller.registerPharmaceuticals ${err.msgError}`);
    throw err;
  }
}

module.exports = {
  registerPharmaceutical,
  updateAlarmUser,
  createAlarmUser,
  deleteAlarmUser,
  checkLoginUser,
  insertOneUser,
  registerBox,
  getOneUser,
  getAllUser,
};
