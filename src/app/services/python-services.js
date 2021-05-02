const { execSync } = require("child_process");

function getLifecycle(url, username, password, tableIndex) {
  try {
    let command = `python ./src/Python/collectTables.py "${url}" ${tableIndex}`;

    if (username || password) {
      command = `${command} "${username}" "${password}"`;
    } else {
      command = `${command} "" ""`;
    }

    const resultSet = execSync(command);

    const refexp = /TimeoutError/;
    const timeoutErr = resultSet.toString().match(refexp);

    if (timeoutErr) {
      throw new Error("Timeout");
    }

    return JSON.parse(resultSet);
  } catch (err) {
    console.log(`[python-services.getLifecycle] ${err.message}`);
    throw err;
  }
}

module.exports = {
  getLifecycle,
};
