/* eslint-disable no-console */

const { StatusCodes } = require("http-status-codes");
const userController = require("./user-controller");

class Controller {
  static routes() {
    return {
      getAllUser: "/getAllUser",
      checkLoginUser: "/checkLoginUser",
    };
  }

  static formatResponseBody(body) {
    return {
      error: body.error,
      msgError: body.msgError,
      response: body.response,
    };
  }

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
}
module.exports = Controller;
