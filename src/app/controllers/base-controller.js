/* eslint-disable no-console */

const { StatusCodes } = require("http-status-codes");
const userController = require("./user-controller");
const boxController = require("./box-controller");

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
      },
      Box: {
        getAllBox: "/getAllBox",
        insertOneBox: "/insertOneBox",
        deleteOneBox: "/deleteOneBox",
        updateBox: "/updateBox",
      },
      Pharmaceutical: {},
    };
  }

  static formatResponseBody(body) {
    return {
      error: body.error || true,
      msgError: body.msgError || "Internal Server Error",
      response: body.response || {},
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
}
module.exports = Controller;
