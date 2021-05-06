const BaseController = require("../controllers/base-controller");

module.exports = app => {
  const reportRoutes = BaseController.routes();

  // Users endpoints
  app.get(reportRoutes.getAllUser, BaseController.getAllUser());

  app.post(reportRoutes.checkLoginUser, BaseController.checkLoginUser());
  app.post(reportRoutes.insertOneUser, BaseController.insertOneUser());
};
