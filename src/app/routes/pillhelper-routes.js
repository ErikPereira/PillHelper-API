const BaseController = require("../controllers/base-controller");

module.exports = app => {
  const { User, Box, Supervisor } = BaseController.routes();

  // Users endpoints

  app.get(User.getAllUser, BaseController.getAllUser());

  app.post(User.getOneUser, BaseController.getOneUser());
  app.post(User.updateAlarmUser, BaseController.updateAlarmUser());
  app.post(User.updateBoxUser, BaseController.updateBoxUser());
  app.post(User.createAlarmUser, BaseController.createAlarmUser());
  app.post(User.deleteAlarmUser, BaseController.deleteAlarmUser());
  app.post(User.deleteBoxInUser, BaseController.deleteBoxInUser());
  app.post(User.checkLogin, BaseController.checkLogin());
  app.post(User.insertOneUser, BaseController.insertOneUser());
  app.post(User.registerBox, BaseController.registerBox());
  app.post(User.registerSupervisor, BaseController.registerSupervisor());
  app.post(
    User.deleteSupervisorInUser,
    BaseController.deleteSupervisorInUser()
  );
  app.post(
    User.updateSupervisorInUser,
    BaseController.updateSupervisorInUser()
  );
  app.post(User.addClinicalData, BaseController.addClinicalData());
  app.post(User.deleteClinicalData, BaseController.deleteClinicalData());
  app.post(User.updateClinicalData, BaseController.updateClinicalData());
  // Box endpoints

  app.get(Box.getAllBox, BaseController.getAllBox());
  app.get(Box.insertOneBox, BaseController.insertOneBox());

  app.post(Box.deleteOneBox, BaseController.deleteOneBox());
  app.post(Box.updateBox, BaseController.updateBox());

  // Supervisor endpoints

  app.get(Supervisor.getAllSupervisor, BaseController.getAllSupervisor());

  app.post(
    Supervisor.insertOneSupervisor,
    BaseController.insertOneSupervisor()
  );
  app.post(Supervisor.updateSupervisor, BaseController.updateSupervisor());
  app.post(Supervisor.registerUser, BaseController.registerUser());
  app.post(Supervisor.getOneSupervisor, BaseController.getOneSupervisor());
  app.post(
    Supervisor.updateUserInSupervisor,
    BaseController.updateUserInSupervisor()
  );
  app.post(
    Supervisor.deleteUserInSupervisor,
    BaseController.deleteUserInSupervisor()
  );
};
