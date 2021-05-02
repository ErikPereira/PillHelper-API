const customAxios = require("../../config/custom-axios");

async function getLifecycle(url) {
  const request = {
    url,
    method: "get",
    body: "",
  };
  const result = await customAxios(request);
  return result.data;
}

module.exports = {
  getLifecycle,
};
