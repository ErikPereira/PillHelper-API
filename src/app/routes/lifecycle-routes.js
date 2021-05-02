const LifecycleController = require("../controllers/base-controller");

module.exports = app => {
  const reportRoutes = LifecycleController.routes();

  app.get(reportRoutes.getLifecycle, LifecycleController.getLifecycle());
};
