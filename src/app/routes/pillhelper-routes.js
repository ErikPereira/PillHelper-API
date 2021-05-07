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
  app.post(User.registerBox, BaseController.registerBox());

  // Box endpoints

  app.get(Box.getAllBox, BaseController.getAllBox());
  app.get(Box.insertOneBox, BaseController.insertOneBox());

  app.post(Box.deleteOneBox, BaseController.deleteOneBox());
  app.post(Box.updateBox, BaseController.updateBox());

  // Pharmaceutical endpoints
};
