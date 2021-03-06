/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
// const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const { encode } = require("js-base64");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const mongoUserController = require("./mongo/mongoUser-controller");
const boxController = require("./box-controller");
const supervisorController = require("./supervisor-controller");
const bullaController = require("./bulla-controller");

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

async function checkLogin(login) {
  try {
    const credentials = {
      email: login.email || "empty",
      cell: login.cell || "empty",
      password: login.password,
    };
    const result = await mongoUserController.getLoginUser();
    const check = result.find(
      user =>
        user.login.password === encode(credentials.password) &&
        (user.login.cell === credentials.cell ||
          user.login.email === credentials.email)
    );
    let uuid;
    if (check === undefined) {
      uuid = {
        uuid: await supervisorController.checkLoginSupervisor(credentials),
        who: "supervisor",
      };
    } else {
      uuid = {
        uuid: check.uuid,
        who: "user",
      };
    }

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: uuid,
    };
  } catch (err) {
    console.log(`[user-controller.checkLogin] ${err.msgError}`);
    throw err;
  }
}

async function insertOneUser(credentials) {
  // check if login recive is valide
  try {
    await checkLogin(credentials);
    return {
      status: StatusCodes.CONFLICT,
      error: true,
      msgError: "email ou celular j?? cadastrado",
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
        error: true,
        msgError: "ERRO: Este supervisor j?? esta vinculado",
        response: "",
      };
    }

    if (
      supervisor.users.find(u => {
        return u.uuidUser === user.uuid;
      })
    ) {
      return {
        status: StatusCodes.OK,
        error: true,
        msgError:
          "ERRO: aguarde a confirma????o de desvinculo do supervisor para tentar novamente",
        response: "",
      };
    }

    supervisor.users.push({
      uuidUser: user.uuid,
      registeredBy: "User",
      bond: "wait",
      name: user.login.email || user.login.cell,
    });

    const register = {
      uuidSupervisor: supervisor.uuidSupervisor,
      registeredBy: "User",
      bond: "wait",
      name:
        body.loginSupervisor.name ||
        supervisor.login.email ||
        supervisor.login.cell,
    };

    user.supervisors.push(register);

    await mongoUserController.updateUser(user);
    await supervisorController.updateSupervisor(supervisor);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: register,
    };
  } catch (err) {
    console.log(`[user-controller.registerSupervisor] ${err.msgError}`);
    throw err;
  }
}

async function deleteSupervisorInUser(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);
    const supervisor = (
      await supervisorController.getOneSupervisorUuid(body.uuidSupervisor)
    ).response;

    user.supervisors = user.supervisors.filter(sup => {
      return sup.uuidSupervisor !== supervisor.uuidSupervisor;
    });

    await mongoUserController.updateUser(user);

    let modify = false;
    supervisor.users = supervisor.users.map(use => {
      const u = use;
      if (u.uuidUser === user.uuid) {
        u.registeredBy = "User";
        u.bond = body.bondSupervisor;
        modify = true;
      }
      return u;
    });

    if (modify) {
      await supervisorController.updateSupervisor(supervisor);
    }

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Supervisor unlink successfully",
    };
  } catch (err) {
    console.log(`[user-controller.deleteSupervisorInUser] ${err.msgError}`);
    throw err;
  }
}

async function acceptedUpdate(uuidSupervisor, uuidUser) {
  try {
    const supervisor = (
      await supervisorController.getOneSupervisorUuid(uuidSupervisor)
    ).response;

    supervisor.users = supervisor.users.map(u => {
      const user = u;
      if (user.uuidUser === uuidUser) {
        user.bond = "accepted";
      }
      return user;
    });

    await supervisorController.updateSupervisor(supervisor);
  } catch (err) {
    console.log(`[user-controller.acceptedUpdate] ${err.msgError}`);
    throw err;
  }
}

async function updateSupervisorInUser(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);

    const modify = {
      check: false,
      uudiUser: "",
      uuidSupervisor: "",
    };

    user.supervisors = user.supervisors.map(sup => {
      let supervisor = sup;
      if (supervisor.uuidSupervisor === body.supervisor.uuidSupervisor) {
        if (supervisor.bond === "wait" && body.supervisor.bond === "accepted") {
          modify.check = true;
          modify.uudiUser = body.uuidUser;
          modify.uuidSupervisor = supervisor.uuidSupervisor;
        }
        supervisor = body.supervisor;
      }
      return supervisor;
    });

    if (modify.check)
      await acceptedUpdate(modify.uuidSupervisor, modify.uudiUser);

    await mongoUserController.updateUser(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Supervisor in User updated successfully",
    };
  } catch (err) {
    console.log(`[user-controller.updateSupervisorInUser] ${err.msgError}`);
    throw err;
  }
}

async function addClinicalData(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);

    const find = user.clinicalData.clinicalDataNames.find(
      name => name === body.nameClinicalData
    );

    if (find) {
      return {
        status: StatusCodes.CONFLICT,
        error: false,
        msgError: "Clinical data already existing",
        response: "",
      };
    }

    user.clinicalData.clinicalDataNames.push(body.nameClinicalData);
    user.clinicalData = {
      ...user.clinicalData,
      [body.nameClinicalData]: body.valueClinicalData,
    };

    await mongoUserController.updateUser(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Clinical data added",
    };
  } catch (err) {
    console.log(`[user-controller.addClinicalData] ${err.msgError}`);
    throw err;
  }
}

async function deleteClinicalData(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);
    let find = user.clinicalData.clinicalDataNames.length;

    user.clinicalData.clinicalDataNames = _.remove(
      user.clinicalData.clinicalDataNames,
      name => name !== body.nameClinicalData
    );

    find = find !== user.clinicalData.clinicalDataNames.length;

    if (!find) {
      return {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: "Clinical data Not Found",
        response: "",
      };
    }

    delete user.clinicalData[body.nameClinicalData];

    await mongoUserController.updateUser(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Clinical data deleted",
    };
  } catch (err) {
    console.log(`[user-controller.deleteClinicalData] ${err.msgError}`);
    throw err;
  }
}

async function updateClinicalData(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);
    const find = user.clinicalData.clinicalDataNames.find(
      name => name === body.nameClinicalData
    );

    if (!find) {
      return {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: "Clinical data Not Found",
        response: "",
      };
    }

    user.clinicalData[body.nameClinicalData] = body.valueClinicalData;

    await mongoUserController.updateUser(user);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Clinical data updated",
    };
  } catch (err) {
    console.log(`[user-controller.updateClinicalData] ${err.msgError}`);
    throw err;
  }
}

async function addBullaUser(user, bulla) {
  try {
    let add = false;
    const alreadyExists = bullaController.checkBullaAlreadyRegistered(bulla.nameBulla, user);
    if(!alreadyExists){
      user.bulla.push(bulla);
      await mongoUserController.updateUser(user);
      add = true; 
    }
    return add;
  } catch (err) {
    console.log(`[user-controller.addBullaUser] ${err.msgError}`);
    throw err;
  }
}

module.exports = {
  deleteSupervisorInUser,
  updateSupervisorInUser,
  registerSupervisor,
  updateClinicalData,
  deleteClinicalData,
  addClinicalData,
  updateAlarmUser,
  createAlarmUser,
  deleteAlarmUser,
  deleteBoxInUser,
  updateBoxUser,
  insertOneUser,
  addBullaUser,
  registerBox,
  getOneUser,
  getAllUser,
  checkLogin,
};
