/* eslint-disable no-console */

const { StatusCodes } = require("http-status-codes");
const moment = require("moment");

const lifecycleController = require("./lifecycle-controller");

const CollectorResponse = require("../utils/response/CollectorResponse");

class Controller {
  static routes() {
    return {
      getLifecycle: "/getLifecycle",
    };
  }

  static formatResponseBody(body, requestInfo) {
    const { startedAt } = requestInfo;
    if (body.error) {
      return new CollectorResponse({
        startedAt,
        endedAt: moment(),
        error: body.error,
        status: "error",
      });
    }

    return new CollectorResponse({
      startedAt,
      body,
      endedAt: moment(),
      status: "succeeded",
    });
  }

  static getLifecycle() {
    const requestInfo = {
      startedAt: moment(),
    };

    return async (req, res) => {
      try {
        const lifecycleResponse = await lifecycleController.getLifecycle(
          req.query
        );
        res
          .status(StatusCodes.OK)
          .send(this.formatResponseBody(lifecycleResponse, requestInfo));
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send(this.formatResponseBody({ error: error.message }, requestInfo));
      }
    };
  }
}
module.exports = Controller;
