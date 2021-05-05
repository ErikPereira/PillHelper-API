/* eslint-disable no-console */

const { StatusCodes } = require("http-status-codes");
const pillhelperController = require("./pillhelper-controller");

class Controller {
  static routes() {
    return {
      getAllUser: "/getAllUser",
    };
  }

  static formatResponseBody(body) {
    return {
      error: body.error,
      response: body.response,
    };
  }

  static getAllUser() {
    return async (req, res) => {
      try {
        const getAllUserResponse = await pillhelperController.getAllUser();
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
}
module.exports = Controller;
