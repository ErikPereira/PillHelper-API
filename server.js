require("./src/config/env-config");
const app = require("./src/config/custom-express");
const { port } = require("./src/config/server-config");

const defaultPort = 3000;
app.listen(port || defaultPort, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Server running on port ${process.env.SERVER_PORT || defaultPort}`
  );
});
