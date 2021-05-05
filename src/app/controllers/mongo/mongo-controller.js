const MongoDBCollectionDao = require("pill-helper-sdk/src/app/infra/mongodb/mongo-collection-dao");
const Mongo = require("../../../config/mongo");
const utils = require("../../utils/pillhelper-utils");

const mongoDao = new MongoDBCollectionDao(Mongo.oMongoConnection);

async function savePillHelpers(lifeCycles, mongo = Mongo) {
  /* Object to be used as filter in select */

  const jsonFilter = {
    name: lifeCycles.name,
    type: lifeCycles.type,
    product: lifeCycles.product,
  };

  mongoDao.setURI(mongo.oMongoConnection);
  let result = await mongoDao.update(
    mongo.mongoCollectionProductPillHelperData,
    jsonFilter,
    lifeCycles
  );
  if (!result.result) {
    result = await mongoDao.insertOne(
      mongo.mongoCollectionProductPillHelperData,
      lifeCycles
    );
  }

  return result;
}

async function getPillHelpers(lifeCycles, mongo = Mongo) {
  const jsonFilter = {
    name: lifeCycles.name,
    type: lifeCycles.type,
    product: lifeCycles.product,
  };
  mongoDao.setURI(mongo.oMongoConnection);
  return mongoDao.find(mongo.mongoCollectionProductPillHelperData, jsonFilter);
}

async function getAllUser(mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $project: {
          _id: 0,
        },
      },
    ];

    const response = await mongoDao.aggregate(
      mongo.mongoCollectionUser,
      jsonFilter
    );
    utils.checkHasError(response);
    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongo-controller.getAllUser] ${res.msgError}`);
    throw res;
  }
}

async function getLoginUser(mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $project: {
          _id: 0,
          uuid: 1,
          login: 1,
        },
      },
    ];

    const response = await mongoDao.aggregate(
      mongo.mongoCollectionUser,
      jsonFilter
    );
    utils.checkHasError(response);
    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongo-controller.getLoginUser] ${res.msgError}`);
    throw res;
  }
}

module.exports = {
  savePillHelpers,
  getPillHelpers,
  getLoginUser,
  getAllUser,
};
