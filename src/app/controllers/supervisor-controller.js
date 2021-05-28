/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const { StatusCodes } = require("http-status-codes");
const { encode } = require("js-base64");
const mongoSupervisorController = require("./mongo/mongoSupervisor-controller");
const mongoUserController = require("./mongo/mongoUser-controller");

async function getAllSupervisor() {
  try {
    const result = await mongoSupervisorController.getAllSupervisor();
    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: result,
    };
  } catch (err) {
    console.log(`[Supervisor-controller.getAllSupervisor] ${err.msgError}`);
    throw err;
  }
}

async function checkLoginSupervisor(login) {
  try {
    const credentials = {
      email: login.email || "empty",
      cell: login.cell || "empty",
      password: login.password,
    };
    const result = await mongoSupervisorController.getLoginSupervisor();
    const check = result.find(
      supervisor =>
        supervisor.login.password === encode(credentials.password) &&
        (supervisor.login.cell === credentials.cell ||
          supervisor.login.email === credentials.email)
    );

    if (check === undefined) {
      const err = {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: `Supervisor Not Found`,
        response: {},
      };
      throw err;
    }

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: check.uuidSupervisor,
    };
  } catch (err) {
    console.log(`[user-controller.checkLoginSupervisor] ${err.msgError}`);
    throw err;
  }
}

async function insertOneSupervisor(credentials) {
  // check if login recive is valide
  try {
    await checkLoginSupervisor(credentials);
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
    const result = await mongoSupervisorController.insertOneSupervisor(
      credentials
    );
    return {
      status: StatusCodes.CREATED,
      error: false,
      msgError: "",
      response: result.uuidSupervisor,
    };
  } catch (err) {
    console.log(`[Supervisor-controller.insertOneSupervisor] ${err.msgError}`);
    throw err;
  }
}

async function updateSupervisor(upSupervisor) {
  try {
    await mongoSupervisorController.updateSupervisor(upSupervisor);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "Supervisor Updated",
    };
  } catch (err) {
    console.log(`[Supervisor-controller.updateSupervisor] ${err.msgError}`);
    throw err;
  }
}

async function registerUser(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);
    const supervisor = await mongoSupervisorController.getOneSupervisor(
      body.uuidSupervisor
    );

    if (
      supervisor.users.find(u => {
        return u.uuidUser === user.uuid;
      })
    ) {
      return {
        status: StatusCodes.OK,
        error: false,
        msgError: "",
        response: "this User is already in the Supervisor",
      };
    }

    supervisor.users.push({
      uuidUser: user.uuid,
      registeredBy: "Supervisor",
      bond: "wait",
      name: "",
    });
    user.supervisors.push({
      uuidSupervisor: supervisor.uuidSupervisor,
      registeredBy: "Supervisor",
      bond: "wait",
      name: "",
    });

    await mongoUserController.updateUser(user);
    await mongoSupervisorController.updateSupervisor(supervisor);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "User registerd successfully",
    };
  } catch (err) {
    console.log(`[supervisor-controller.registerUser] ${err.msgError}`);
    throw err;
  }
}

async function getOneSupervisor(login) {
  try {
    const loginSupervisor = {
      email: login.email || "empty",
      cell: login.cell || "empty",
    };
    const allSupervisor = await getAllSupervisor();

    const oneSupervisor = allSupervisor.response.find(
      supervisor =>
        supervisor.login.cell === loginSupervisor.cell ||
        supervisor.login.email === loginSupervisor.email
    );

    if (oneSupervisor === undefined) {
      const err = {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: `Supervisor Not Found`,
        response: {},
      };
      throw err;
    }
    return oneSupervisor;
  } catch (err) {
    console.log(`[Supervisor-controller.getOneSupervisor] ${err.msgError}`);
    throw err;
  }
}

async function getOneSupervisorUuid(uuidSupervisor) {
  try {
    const result = await mongoSupervisorController.getOneSupervisor(
      uuidSupervisor
    );
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

module.exports = {
  getOneSupervisorUuid,
  checkLoginSupervisor,
  insertOneSupervisor,
  getOneSupervisor,
  getAllSupervisor,
  updateSupervisor,
  registerUser,
};
