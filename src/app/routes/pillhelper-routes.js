const BaseController = require("../controllers/base-controller");

module.exports = app => {
  const reportRoutes = BaseController.routes();

  app.get(reportRoutes.getAllUser, BaseController.getAllUser());
};
