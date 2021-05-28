/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
// const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const { encode } = require("js-base64");
const { v4: uuidv4 } = require("uuid");
const mongoUserController = require("./mongo/mongoUser-controller");
const boxController = require("./box-controller");
const supervisorController = require("./supervisor-controller");

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
    const uuidAlarm = uuidv4();
    user.alarms.push({ ...newAlarm, uuidAlarm });

    await mongoUserController.updateUser(user);

    return {
      status: StatusCodes.CREATED,
      error: false,
      msgError: "",
      response: uuidAlarm,
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
    const box = await boxController.getOneBox(body.uuidBox);

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
    await boxController.updateBox(box);

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

async function registerSupervisor(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);
    const supervisor = await supervisorController.getOneSupervisor(
      body.loginSupervisor
    );

    if (
      user.supervisors.find(sup => {
        return sup.uuidSupervisor === supervisor.uuidSupervisor;
      })
    ) {
      return {
        status: StatusCodes.OK,
        error: false,
        msgError: "",
        response: "this Supervisor is already in the User",
      };
    }

    supervisor.users.push({
      uuidUser: user.uuid,
      registeredBy: "User",
      bond: "wait",
    });

    user.supervisors.push({
      uuidSupervisor: supervisor.uuidSupervisor,
      registeredBy: "User",
      bond: "wait",
    });

    await mongoUserController.updateUser(user);
    await supervisorController.updateSupervisor(supervisor);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Supervisor registerd successfully",
    };
  } catch (err) {
    console.log(`[user-controller.registerSupervisor] ${err.msgError}`);
    throw err;
  }
}

async function deleteBoxInUser(uuidUser, uuidBox) {
  try {
    await removeBoxInOldUser({ uuidUser, uuidBox });
    await boxController.unlinkBox(uuidBox);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Box unlink successfully",
    };
  } catch (err) {
    console.log(`[user-controller.deleteBoxInUser ${err.msgError}`);
    throw err;
  }
}

async function updateBoxUser(uuidUser, uuidBox, newNameBox) {
  try {
    const user = await mongoUserController.getOneUser(uuidUser);
    const box = await boxController.getOneBox(uuidBox);

    user.box = user.box.map(b => {
      const internal = b;
      if (internal.uuidBox === uuidBox) {
        internal.nameBox = newNameBox;
        box.nameBox = newNameBox;
      }
      return internal;
    });

    await boxController.updateBox(box);
    await mongoUserController.updateUser(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Box update successfully",
    };
  } catch (err) {
    console.log(`[user-controller.updateBoxUser ${err.msgError}`);
    throw err;
  }
}

module.exports = {
  registerSupervisor,
  updateAlarmUser,
  createAlarmUser,
  deleteAlarmUser,
  deleteBoxInUser,
  checkLoginUser,
  updateBoxUser,
  insertOneUser,
  registerBox,
  getOneUser,
  getAllUser,
};
