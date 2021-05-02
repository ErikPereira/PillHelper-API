const lodash = require("lodash");
const request = require("../../config/custom-axios");

// Find a parameter with the name provided and get its value
function getParamValue(parametersArray, paramName) {
  const paramObject = lodash.find(parametersArray, { param: `${paramName}` });
  return lodash.get(paramObject, "value");
}

module.exports = async function httpRequest(collectorJSON) {
  const collectParameters = "parameters";
  const endpoint = lodash.get(collectorJSON, "collect.target.endpoint");
  const method = lodash
    .get(collectorJSON, "collect.target.collectType")
    .substring(
      lodash.get(collectorJSON, "collect.target.collectType").indexOf("-") + 1
    );
  const urlQuery = getParamValue(
    lodash.get(collectorJSON, collectParameters),
    "urlQuery"
  );
  const headers = getParamValue(
    lodash.get(collectorJSON, collectParameters),
    "header"
  );
  const body = getParamValue(
    lodash.get(collectorJSON, collectParameters),
    "body"
  );
  const url = urlQuery ? `${endpoint}?${urlQuery}` : endpoint;
  const res = await request({ method, url, headers, body });
  return res.data;
};
