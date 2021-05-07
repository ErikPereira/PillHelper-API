const BaseController = require("../controllers/base-controller");

module.exports = app => {
  const { User, Box } = BaseController.routes();

  // Users endpoints

  app.get(User.getAllUser, BaseController.getAllUser());

  app.post(User.updateAlarmUser, BaseController.updateAlarmUser());
  app.post(User.createAlarmUser, BaseController.createAlarmUser());
  app.post(User.deleteAlarmUser, BaseController.deleteAlarmUser());
  app.post(User.checkLoginUser, BaseController.checkLoginUser());
  app.post(User.insertOneUser, BaseController.insertOneUser());

  // Box endpoints

  app.get(Box.getAllBox, BaseController.getAllBox());
  app.get(Box.insertOneBox, BaseController.insertOneBox());

  app.post(Box.deleteOneBox, BaseController.deleteOneBox());

  // Pharmaceutical endpoints
};
