const customAxios = require("../../config/custom-axios");

async function getPillHelper(url) {
  const request = {
    url,
    method: "get",
    body: "",
  };
  const result = await customAxios(request);
  return result.data;
}

module.exports = {
  getPillHelper,
};
