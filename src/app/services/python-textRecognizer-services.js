const { execSync } = require("child_process");
const utils = require("../utils/pillhelper-utils");

function getImageString(path) {
  try {
    const command = `python ./src/Python/textRecognizer.py --image ${path} --langs pt,en`;

    const resultSet = execSync(command);

    const refexp = /TimeoutError/;
    const timeoutErr = resultSet.toString().match(refexp);

    if (timeoutErr) {
      throw new Error("Timeout");
    }
    return resultSet.toString().replace("\r\n", "").toLowerCase();
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[python-textRecognizer-services copy.getImageString] ${res.msgError}`
    );
    throw res;
  }
}

module.exports = {
  getImageString,
};
