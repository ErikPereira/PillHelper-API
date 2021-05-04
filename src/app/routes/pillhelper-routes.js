const BaseController = require("../controllers/base-controller");

module.exports = app => {
  const reportRoutes = BaseController.routes();

  app.post(reportRoutes.test, BaseController.test());
};
