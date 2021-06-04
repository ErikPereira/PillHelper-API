/* eslint-disable no-console */

const { StatusCodes } = require("http-status-codes");
const userController = require("./user-controller");
const boxController = require("./box-controller");
const supervisorController = require("./supervisor-controller");

class Controller {
  static routes() {
    return {
      User: {
        getAllUser: "/getAllUser",
        getOneUser: "/getOneUSer",
        insertOneUser: "/insertOneUser",
        checkLoginUser: "/checkLoginUser",
        createAlarmUser: "/createAlarmUser",
        updateAlarmUser: "/updateAlarmUser",
        updateBoxUser: "/updateBoxUser",
        deleteAlarmUser: "/deleteAlarmUser",
        deleteBoxInUser: "/deleteBoxInUser",
        registerBox: "/registerBox",
        registerSupervisor: "/registerSupervisor",
        deleteSupervisorInUser: "/deleteSupervisorInUser",
        updateSupervisorInUser: "/updateSupervisorInUser",
        addClinicalData: "/addClinicalData",
        deleteClinicalData: "/deleteClinicalData",
        updateClinicalData: "/updateClinicalData",
      },
      Box: {
        getAllBox: "/getAllBox",
        insertOneBox: "/insertOneBox",
        deleteOneBox: "/deleteOneBox",
        updateBox: "/updateBox",
      },
      Supervisor: {
        updateUserInSupervisor: "/updateUserInSupervisor",
        getAllSupervisor: "/getAllSupervisor",
        insertOneSupervisor: "/insertOneSupervisor",
        checkLoginSupervisor: "/checkLoginSupervisor",
        updateSupervisor: "/updateSupervisor",
        registerUser: "/registerUser",
      },
    };
  }

  static formatResponseBody(body) {
    const defaultMsg = "Internal Server Error";
    return {
      error: body.error === undefined ? true : body.error,
      msgError: body.msgError === undefined ? defaultMsg : body.msgError,
      response: body.response === undefined ? {} : body.response,
    };
  }

  // Start endpoints User

  static getAllUser() {
    return async (req, res) => {
      try {
        const getAllUserResponse = await userController.getAllUser();
        res
          .status(getAllUserResponse.status)
          .send(this.formatResponseBody(getAllUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static getOneUser() {
    return async (req, res) => {
      try {
        const getOneUserResponse = await userController.getOneUser(
          req.body.uuid
        );
        res
          .status(getOneUserResponse.status)
          .send(this.formatResponseBody(getOneUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static checkLoginUser() {
    return async (req, res) => {
      try {
        const checkLoginUserResponse = await userController.checkLoginUser(
          req.body
        );
        res
          .status(checkLoginUserResponse.status)
          .send(this.formatResponseBody(checkLoginUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static insertOneUser() {
    return async (req, res) => {
      try {
        const insertOneUserResponse = await userController.insertOneUser(
          req.body
        );
        res
          .status(insertOneUserResponse.status)
          .send(this.formatResponseBody(insertOneUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static createAlarmUser() {
    return async (req, res) => {
      try {
        const createAlarmUserResponse = await userController.createAlarmUser(
          req.body.uuid,
          req.body.newAlarm
        );
        res
          .status(createAlarmUserResponse.status)
          .send(this.formatResponseBody(createAlarmUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static deleteAlarmUser() {
    return async (req, res) => {
      try {
        const deleteAlarmUserResponse = await userController.deleteAlarmUser(
          req.body.uuidUser,
          req.body.uuidAlarm
        );
        res
          .status(deleteAlarmUserResponse.status)
          .send(this.formatResponseBody(deleteAlarmUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static deleteBoxInUser() {
    return async (req, res) => {
      try {
        const deleteBoxInUserResponse = await userController.deleteBoxInUser(
          req.body.uuidUser,
          req.body.uuidBox
        );
        res
          .status(deleteBoxInUserResponse.status)
          .send(this.formatResponseBody(deleteBoxInUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static updateBoxUser() {
    return async (req, res) => {
      try {
        const updateBoxUserResponse = await userController.updateBoxUser(
          req.body.uuidUser,
          req.body.uuidBox,
          req.body.newNameBox
        );
        res
          .status(updateBoxUserResponse.status)
          .send(this.formatResponseBody(updateBoxUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static updateAlarmUser() {
    return async (req, res) => {
      try {
        const updateAlarmUserResponse = await userController.updateAlarmUser(
          req.body.uuid,
          req.body.updateAlarm
        );
        res
          .status(updateAlarmUserResponse.status)
          .send(this.formatResponseBody(updateAlarmUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static registerBox() {
    return async (req, res) => {
      try {
        const registerBoxResponse = await userController.registerBox(req.body);
        res
          .status(registerBoxResponse.status)
          .send(this.formatResponseBody(registerBoxResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static registerSupervisor() {
    return async (req, res) => {
      try {
        const registerSupervisorResponse = await userController.registerSupervisor(
          req.body
        );
        res
          .status(registerSupervisorResponse.status)
          .send(this.formatResponseBody(registerSupervisorResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static deleteSupervisorInUser() {
    return async (req, res) => {
      try {
        const deleteSupervisorInUserResponse = await userController.deleteSupervisorInUser(
          req.body
        );
        res
          .status(deleteSupervisorInUserResponse.status)
          .send(this.formatResponseBody(deleteSupervisorInUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static updateSupervisorInUser() {
    return async (req, res) => {
      try {
        const updateSupervisorInUserResponse = await userController.updateSupervisorInUser(
          req.body
        );
        res
          .status(updateSupervisorInUserResponse.status)
          .send(this.formatResponseBody(updateSupervisorInUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static addClinicalData() {
    return async (req, res) => {
      try {
        const addClinicalDataResponse = await userController.addClinicalData(
          req.body
        );
        res
          .status(addClinicalDataResponse.status)
          .send(this.formatResponseBody(addClinicalDataResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static deleteClinicalData() {
    return async (req, res) => {
      try {
        const deleteClinicalDataResponse = await userController.deleteClinicalData(
          req.body
        );
        res
          .status(deleteClinicalDataResponse.status)
          .send(this.formatResponseBody(deleteClinicalDataResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static updateClinicalData() {
    return async (req, res) => {
      try {
        const updateClinicalDataResponse = await userController.updateClinicalData(
          req.body
        );
        res
          .status(updateClinicalDataResponse.status)
          .send(this.formatResponseBody(updateClinicalDataResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  // Finish endpoints User

  // Start endpoints Box

  static getAllBox() {
    return async (req, res) => {
      try {
        const getAllBoxResponse = await boxController.getAllBox();
        res
          .status(getAllBoxResponse.status)
          .send(this.formatResponseBody(getAllBoxResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static insertOneBox() {
    return async (req, res) => {
      try {
        const insertOneBoxResponse = await boxController.insertOneBox();
        res
          .status(insertOneBoxResponse.status)
          .send(this.formatResponseBody(insertOneBoxResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static deleteOneBox() {
    return async (req, res) => {
      try {
        const deleteOneBoxResponse = await boxController.deleteOneBox(
          req.body.uuidBox
        );
        res
          .status(deleteOneBoxResponse.status)
          .send(this.formatResponseBody(deleteOneBoxResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static updateBox() {
    return async (req, res) => {
      try {
        const updateBoxResponse = await boxController.updateBox(req.body);
        res
          .status(updateBoxResponse.status)
          .send(this.formatResponseBody(updateBoxResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  // Finish endpoints Box

  // Start endpoints Supervisor

  static getAllSupervisor() {
    return async (req, res) => {
      try {
        const getAllSupervisorResponse = await supervisorController.getAllSupervisor();
        res
          .status(getAllSupervisorResponse.status)
          .send(this.formatResponseBody(getAllSupervisorResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static insertOneSupervisor() {
    return async (req, res) => {
      try {
        const insertOneSupervisorResponse = await supervisorController.insertOneSupervisor(
          req.body
        );
        res
          .status(insertOneSupervisorResponse.status)
          .send(this.formatResponseBody(insertOneSupervisorResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static checkLoginSupervisor() {
    return async (req, res) => {
      try {
        const checkLoginSupervisorResponse = await supervisorController.checkLoginSupervisor(
          req.body
        );
        res
          .status(checkLoginSupervisorResponse.status)
          .send(this.formatResponseBody(checkLoginSupervisorResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static updateSupervisor() {
    return async (req, res) => {
      try {
        const updateSupervisorResponse = await supervisorController.updateSupervisor(
          req.body
        );
        res
          .status(updateSupervisorResponse.status)
          .send(this.formatResponseBody(updateSupervisorResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static registerUser() {
    return async (req, res) => {
      try {
        const registerUserResponse = await supervisorController.registerUser(
          req.body
        );
        res
          .status(registerUserResponse.status)
          .send(this.formatResponseBody(registerUserResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static updateUserInSupervisor() {
    return async (req, res) => {
      try {
        const updateUserInSupervisorResponse = await supervisorController.updateUserInSupervisor(
          req.body
        );
        res
          .status(updateUserInSupervisorResponse.status)
          .send(this.formatResponseBody(updateUserInSupervisorResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  // Finish endpoints Supervisor
}
module.exports = Controller;
