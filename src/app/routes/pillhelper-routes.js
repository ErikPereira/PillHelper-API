const BaseController = require("../controllers/base-controller");

module.exports = app => {
  const reportRoutes = BaseController.routes();

  // Users endpoints
  app.get(reportRoutes.getAllUser, BaseController.getAllUser());

  app.post(reportRoutes.createAlarmUser, BaseController.createAlarmUser());
  app.post(reportRoutes.deleteAlarmUser, BaseController.deleteAlarmUser());
  app.post(reportRoutes.checkLoginUser, BaseController.checkLoginUser());
  app.post(reportRoutes.insertOneUser, BaseController.insertOneUser());
};
