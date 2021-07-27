const { execSync } = require("child_process");
const utils = require("../utils/pillhelper-utils");

function getWebInformation(url) {
  try {
    const command = `python ./src/Python/webScraping.py "${url}"`;

    const resultSet = execSync(command);

    let adaptation = resultSet.toString().replace(/"/g, 'fixOfProblemWithQuotes');
    adaptation = adaptation.toString().replace(/'/g, '"');
    adaptation = adaptation.toString().replace(/fixOfProblemWithQuotes/g, "'");

    return JSON.parse(adaptation);
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[python-webScraping-services.getWebInformation] ${res.msgError}`
    );
    throw res;
  }
}

module.exports = {
  getWebInformation,
};
