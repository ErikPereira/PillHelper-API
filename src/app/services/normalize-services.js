const _ = require("lodash");
const utils = require("../utils/lifecycle-utils");
const mongoController = require("../controllers/mongo/mongo-controller");

async function getMongoLifeCycles(param) {
  try {
    const mongoResult = await mongoController.getLifeCycles(param);
    utils.checkHasError(mongoResult);
    utils.checkNotFound(mongoResult.result, "Mongo, product_lifecycle_data");
    return mongoResult.result[0].lifecycle;
  } catch (err) {
    return [];
  }
}

async function normalization(lifecycles, param) {
  const tableMapping = param.table_mapping;
  return {
    normalized: lifecycles.map(lifecycle => {
      const normalized = {};
      _.forEach(lifecycle, (value, key) => {
        const columnMapping = tableMapping.columnMapping.find(mapping => {
          return mapping.origName === key;
        });

        if (!columnMapping) {
          throw new Error("Discrepancy");
        }

        normalized[columnMapping.normName] = value;
      });
      return normalized;
    }),
    result: "Success",
  };
}

module.exports = {
  normalization,
  getMongoLifeCycles,
};
