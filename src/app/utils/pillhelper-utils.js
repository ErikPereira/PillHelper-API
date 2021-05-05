/* eslint-disable no-console */

require("../../config/env-config");
const _ = require("lodash");
const { StatusCodes } = require("http-status-codes");
const httpRequest = require("./http-request");

class TemplateUtils {
  static async request(body) {
    try {
      return httpRequest({
        collect: {
          target: {
            endpoint: process.env.EXTERNAL_SERVICE_URL,
            collectType: "post",
          },
        },
        parameters: [
          {
            param: "header",
            value: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
            },
          },
          {
            param: "body",
            value: body,
          },
        ],
      });
    } catch (exception) {
      console.log(`[Service-Utils.request]: ${exception}`);
      throw exception;
    }
  }

  static checkHasError(response) {
    let err = {};
    if (response.hasError) {
      err = {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: response.hasError,
        msgError: response.msgError,
        response: {},
      };
      throw err;
    }
  }

  static checkError(err) {
    const { msgError } = err;
    const internalError = "Internal Server Error";

    if (msgError === undefined) {
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: true,
        msgError: err.message || internalError,
        response: {},
      };
    }
    return err;
  }

  static checkNotFound(result, message) {
    let err = {};
    if (result.length === 0) {
      err = {
        status: StatusCodes.NOT_FOUND,
        error: true,
        msgError: `Not Found - ${message}`,
        response: {},
      };
      throw err;
    }
  }

  static differenceBetweenDatesInDays(start, finish) {
    if (!start || !finish) {
      return 0;
    }
    const difference = Math.abs(start.getTime() - finish.getTime());
    const millisecond = 1000;
    const seconds = 3600;
    const hours = 24;
    return Math.ceil(difference / (millisecond * seconds * hours));
  }

  static getUrlQuery(parameter) {
    let urlQuery = "";

    _.forIn(parameter, (value, key) => {
      urlQuery += `upper(${key}) = upper('${value}') and `;
    });
    urlQuery = urlQuery.replace(/ and $/g, "");

    return urlQuery;
  }
}

module.exports = TemplateUtils;
