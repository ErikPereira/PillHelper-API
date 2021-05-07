/* eslint-disable no-console */

const { StatusCodes } = require("http-status-codes");
const userController = require("./user-controller");
const boxController = require("./box-controller");
const pharController = require("./pharmaceutical-controller");

class Controller {
  static routes() {
    return {
      User: {
        getAllUser: "/getAllUser",
        insertOneUser: "/insertOneUser",
        checkLoginUser: "/checkLoginUser",
        createAlarmUser: "/createAlarmUser",
        deleteAlarmUser: "/deleteAlarmUser",
        updateAlarmUser: "/updateAlarmUser",
        registerBox: "/registerBox",
      },
      Box: {
        getAllBox: "/getAllBox",
        insertOneBox: "/insertOneBox",
        deleteOneBox: "/deleteOneBox",
        updateBox: "/updateBox",
      },
      Pharmaceutical: {
        getAllPharmaceutical: "/getAllPharmaceutical",
        insertOnePharmaceutical: "/insertOnePharmaceutical",
        checkLoginPharmaceutical: "/checkLoginPharmaceutical",
        updatePharmaceutical: "/updatePharmaceutical",
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

  // Start endpoints Pharmaceutical

  static getAllPharmaceutical() {
    return async (req, res) => {
      try {
        const getAllPharmaceuticalResponse = await pharController.getAllPharmaceutical();
        res
          .status(getAllPharmaceuticalResponse.status)
          .send(this.formatResponseBody(getAllPharmaceuticalResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static insertOnePharmaceutical() {
    return async (req, res) => {
      try {
        const insertOnePharmaceuticalResponse = await pharController.insertOnePharmaceutical(
          req.body
        );
        res
          .status(insertOnePharmaceuticalResponse.status)
          .send(this.formatResponseBody(insertOnePharmaceuticalResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static checkLoginPharmaceutical() {
    return async (req, res) => {
      try {
        const checkLoginPharmaceuticalResponse = await pharController.checkLoginPharmaceutical(
          req.body
        );
        res
          .status(checkLoginPharmaceuticalResponse.status)
          .send(this.formatResponseBody(checkLoginPharmaceuticalResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  static updatePharmaceutical() {
    return async (req, res) => {
      try {
        const updatePharmaceuticalResponse = await pharController.updatePharmaceutical(
          req.body
        );
        res
          .status(updatePharmaceuticalResponse.status)
          .send(this.formatResponseBody(updatePharmaceuticalResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody(error));
      }
    };
  }

  // Finish endpoints Pharmaceutical
}
module.exports = Controller;
