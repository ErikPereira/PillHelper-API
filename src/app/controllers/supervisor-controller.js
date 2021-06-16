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
    console.log(`[supervisor-controller.getAllSupervisor] ${err.msgError}`);
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
        msgError: `Not Found`,
        response: {},
      };
      throw err;
    }

    return check.uuidSupervisor;
  } catch (err) {
    console.log(`[supervisor-controller.checkLoginSupervisor] ${err.msgError}`);
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
    console.log(`[supervisor-controller.insertOneSupervisor] ${err.msgError}`);
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
    console.log(`[supervisor-controller.updateSupervisor] ${err.msgError}`);
    throw err;
  }
}

async function registerUser(body) {
  try {
    const supervisor = await mongoSupervisorController.getOneSupervisor(
      body.uuidSupervisor
    );
    const user = await mongoUserController.getOneUserLogin(body.loginUser);

    if (
      supervisor.users.find(u => {
        return u.uuidUser === user.uuid;
      })
    ) {
      return {
        status: StatusCodes.OK,
        error: true,
        msgError: "ERRO: Este Usuários já esta vinculado",
        response: "",
      };
    }

    if (
      user.supervisors.find(sup => {
        return sup.uuidSupervisor === supervisor.uuidSupervisor;
      })
    ) {
      return {
        status: StatusCodes.OK,
        error: true,
        msgError:
          "ERRO: aguarde a confirmação de desvinculo do usuário para tentar novamente",
        response: "",
      };
    }
    const register = {
      uuidUser: user.uuid,
      registeredBy: "Supervisor",
      bond: "wait",
      name: body.loginUser.name || user.login.email || user.login.cell,
    };

    supervisor.users.push(register);

    user.supervisors.push({
      uuidSupervisor: supervisor.uuidSupervisor,
      registeredBy: "Supervisor",
      bond: "wait",
      name: supervisor.login.email || supervisor.login.cell,
    });

    await mongoUserController.updateUser(user);
    await mongoSupervisorController.updateSupervisor(supervisor);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: register,
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
    console.log(`[supervisor-controller.getOneSupervisor] ${err.msgError}`);
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
    console.log(`[supervisor-controller.getOneSupervisorUuid] ${err.msgError}`);
    throw err;
  }
}

async function acceptedUpdate(uuidSupervisor, uuidUser) {
  try {
    const user = await mongoUserController.getOneUser(uuidUser);

    user.supervisors = user.supervisors.map(sup => {
      const supervisor = sup;
      if (supervisor.uuidSupervisor === uuidSupervisor) {
        supervisor.bond = "accepted";
      }
      return supervisor;
    });

    await mongoUserController.updateUser(user);
  } catch (err) {
    console.log(`[supervisor-controller.acceptedUpdate] ${err.msgError}`);
    throw err;
  }
}

async function updateUserInSupervisor(body) {
  try {
    const supervisor = await mongoSupervisorController.getOneSupervisor(
      body.uuidSupervisor
    );
    const modify = {
      check: false,
      uudiUser: "",
      uuidSupervisor: "",
    };

    supervisor.users = supervisor.users.map(u => {
      let user = u;
      if (user.uuidUser === body.user.uuidUser) {
        if (user.bond === "wait" && body.user.bond === "accepted") {
          modify.check = true;
          modify.uudiUser = user.uuidUser;
          modify.uuidSupervisor = body.uuidSupervisor;
        }
        user = body.user;
      }
      return user;
    });

    if (modify.check)
      await acceptedUpdate(modify.uuidSupervisor, modify.uudiUser);

    await mongoSupervisorController.updateSupervisor(supervisor);

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "User in Supervisor updated successfully",
    };
  } catch (err) {
    console.log(
      `[supervisor-controller.updateUserInSupervisor] ${err.msgError}`
    );
    throw err;
  }
}

async function deleteUserInSupervisor(body) {
  try {
    const user = await mongoUserController.getOneUser(body.uuidUser);
    const supervisor = (await getOneSupervisorUuid(body.uuidSupervisor))
      .response;

    supervisor.users = supervisor.users.filter(u => {
      return u.uuidUser !== user.uuid;
    });

    await updateSupervisor(supervisor);

    let modify = false;
    user.supervisors = user.supervisors.map(sup => {
      const s = sup;
      if (s.uuidSupervisor === supervisor.uuidSupervisor) {
        s.registeredBy = "Supervisor";
        s.bond = body.bondUser;
        modify = true;
      }
      return s;
    });

    if (modify) {
      await mongoUserController.updateUser(user);
    }

    return {
      status: StatusCodes.OK,
      error: false,
      msgError: "",
      response: "User unlink successfully",
    };
  } catch (err) {
    console.log(
      `[supervisor-controller.deleteUserInSupervisor] ${err.msgError}`
    );
    throw err;
  }
}

module.exports = {
  deleteUserInSupervisor,
  updateUserInSupervisor,
  getOneSupervisorUuid,
  checkLoginSupervisor,
  insertOneSupervisor,
  getOneSupervisor,
  getAllSupervisor,
  updateSupervisor,
  registerUser,
};
