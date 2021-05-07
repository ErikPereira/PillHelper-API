const BaseController = require("../controllers/base-controller");

module.exports = app => {
  const { User, Box, Pharmaceutical } = BaseController.routes();

  // Users endpoints

  app.get(User.getAllUser, BaseController.getAllUser());

  app.post(User.updateAlarmUser, BaseController.updateAlarmUser());
  app.post(User.createAlarmUser, BaseController.createAlarmUser());
  app.post(User.deleteAlarmUser, BaseController.deleteAlarmUser());
  app.post(User.checkLoginUser, BaseController.checkLoginUser());
  app.post(User.insertOneUser, BaseController.insertOneUser());
  app.post(User.registerBox, BaseController.registerBox());
  app.post(
    User.registerPharmaceutical,
    BaseController.registerPharmaceutical()
  );

  // Box endpoints

  app.get(Box.getAllBox, BaseController.getAllBox());
  app.get(Box.insertOneBox, BaseController.insertOneBox());

  app.post(Box.deleteOneBox, BaseController.deleteOneBox());
  app.post(Box.updateBox, BaseController.updateBox());

  // Pharmaceutical endpoints

  app.get(
    Pharmaceutical.getAllPharmaceutical,
    BaseController.getAllPharmaceutical()
  );

  app.post(
    Pharmaceutical.insertOnePharmaceutical,
    BaseController.insertOnePharmaceutical()
  );
  app.post(
    Pharmaceutical.checkLoginPharmaceutical,
    BaseController.checkLoginPharmaceutical()
  );
  app.post(
    Pharmaceutical.updatePharmaceutical,
    BaseController.updatePharmaceutical()
  );
  app.post(Pharmaceutical.registerUser, BaseController.registerUser());
};
