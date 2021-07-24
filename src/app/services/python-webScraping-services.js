const { execSync } = require("child_process");
const utils = require("../utils/pillhelper-utils");

function getWebInformation(url) {
  try {
    const command = command = `python ./src/Python/webScraping.py "${url}"`;

    const resultSet = execSync(command);

    const refexp = /TimeoutError/;
    const timeoutErr = resultSet.toString().match(refexp);

    if (timeoutErr) {
      throw new Error("Timeout");
    }

    return JSON.parse(resultSet);
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[python-textRecognizer-services copy.getWebInformation] ${res.msgError}`
    );
    throw res;
  }
}

module.exports = {
  getWebInformation,
};
