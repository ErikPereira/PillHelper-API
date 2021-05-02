const CollectorLifecycleParamsDao = require("sdk-utils-module/src/app/infra/postgres/collector-lifecycle-params-dao");
const CollectorLifecycleParamsDto = require("sdk-utils-module/src/app/models/collector-lifecycle-params-dto");

const Postgre = require("../../../config/postgre.js");

async function getCollectorLifecycleParams(
  whereCondition,
  connection = Postgre
) {
  const reportsDao = new CollectorLifecycleParamsDao(
    connection.oPostgresConnection
  );
  const reportsDto = new CollectorLifecycleParamsDto(
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  );
  return reportsDao.selectDynamic(reportsDto, whereCondition);
}

async function updateCollectorLifecycleParams(param, connection = Postgre) {
  const reportsDao = new CollectorLifecycleParamsDao(
    connection.oPostgresConnection
  );
  const reportsDto = new CollectorLifecycleParamsDto(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    param.result,
    undefined,
    param.last_attempt_date,
    param.last_extraction_date
  );
  const whereCondition = `name = '${param.name}'`;
  return reportsDao.updateDynamic(reportsDto, whereCondition);
}

module.exports = {
  getCollectorLifecycleParams,
  updateCollectorLifecycleParams,
};
