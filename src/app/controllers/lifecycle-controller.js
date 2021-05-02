/* eslint-disable no-await-in-loop */
const _ = require("lodash");
const postgreController = require("./postgre/postgre-controller");
const mongoController = require("./mongo/mongo-controller");
const Postgre = require("../../config/postgre");
const utils = require("../utils/lifecycle-utils");
const pythonServices = require("../services/python-services");
const axiosServices = require("../services/axios-services");
const normalizeServices = require("../services/normalize-services");

async function getLifecycle(query, postgre = Postgre) {
  try {
    const urlQuery = utils.getUrlQuery(query);
    const result = await postgreController.getCollectorLifecycleParams(
      urlQuery
    );
    utils.checkHasError(result);
    utils.checkNotFound(result.result, "Postgre, collectorLifeCycleParams");

    const params = result.result;
    let apiReturn = [];

    for (let i = 0; i < params.length; i += 1) {
      const param = params[i];
      const lifecycles = {
        name: param.name,
        type: param.type,
        product: param.product,
        app: param.app,
        version: param.version,
        lifecycle: [],
      };
      const difference = utils.differenceBetweenDatesInDays(
        param.last_attempt_date,
        param.last_extraction_date
      );
      const attemptDate = `${new Date().toLocaleString(postgre.language, {
        timeZone: postgre.timezone,
      })} ${postgre.timezone}`;

      let lifecycleNormalized = [];
      let lifecycle;
      let successAttempt = true;

      if (
        !param.last_attempt_date ||
        !param.last_extraction_date ||
        difference > postgre.DIFFERENCE_BETWEEN_ATTEMP_AND_EXTRACTION
      ) {
        param.last_attempt_date = attemptDate;
        try {
          if (param.target === "HTML") {
            lifecycle = pythonServices.getLifecycle(
              param.url,
              param.username,
              param.password,
              param.table_index
            );
          } else if (param.target === "API") {
            lifecycle = await axiosServices.getLifecycle(param.url);
          } else {
            throw new Error("Target unknow");
          }

          if (param.table_mapping.mappingType === "indirect") {
            console.log("step 1");
          }

          const resultNormalized = await normalizeServices.normalization(
            lifecycle,
            param
          );
          lifecycleNormalized = resultNormalized.normalized;
          param.result = resultNormalized.result;
          param.last_extraction_date = `${new Date().toLocaleString(
            postgre.language,
            {
              timeZone: postgre.timezone,
            }
          )} ${postgre.timezone}`;
        } catch (err) {
          switch (err.message) {
            case "Discrepancy":
              param.result = "Discrepancy";
              break;
            case "Timeout":
              param.result = "Timeout";
              break;
            default:
              param.result = "Error";
              break;
          }
          lifecycleNormalized = await normalizeServices.getMongoLifeCycles(
            param
          );
          successAttempt = false;
        }
      } else {
        param.last_attempt_date = attemptDate;
        lifecycleNormalized = await normalizeServices.getMongoLifeCycles(param);
      }
      lifecycles.lifecycle = _.concat(
        lifecycles.lifecycle,
        lifecycleNormalized
      );
      const postgreResult = await postgreController.updateCollectorLifecycleParams(
        param
      );
      utils.checkHasError(postgreResult);

      if (successAttempt) {
        const mongoResult = await mongoController.saveLifeCycles(lifecycles);
        utils.checkHasError(mongoResult);
      }

      apiReturn = _.concat(apiReturn, lifecycleNormalized);
    }
    return { lifecycle: apiReturn };
  } catch (err) {
    console.log(`[lifecycle-collector.getLifecycle] ${err.message}`);
    throw err;
  }
}

module.exports = {
  getLifecycle,
};
