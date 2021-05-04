/* eslint-disable no-console */

const { StatusCodes } = require("http-status-codes");
const CollectorResponse = require("../utils/response/CollectorResponse");
const pillhelperController = require("./pillhelper-controller");

class Controller {
  static routes() {
    return {
      test: "/test",
    };
  }

  static formatResponseBody(body) {
    if (body.error) {
      return new CollectorResponse({
        response: false,
        msg: body.error,
      });
    }

    return new CollectorResponse({
      response: true,
      msg: body,
    });
  }

  static test() {
    return async (req, res) => {
      try {
        const testeResponse = await pillhelperController.teste(req.body);
        res.status(StatusCodes.OK).send(this.formatResponseBody(testeResponse));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody({ error: error.message }));
      }
    };
  }
}
module.exports = Controller;
