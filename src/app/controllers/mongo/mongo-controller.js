const MongoDBCollectionDao = require("pill-helper-sdk/src/app/infra/mongodb/mongo-collection-dao");

const Mongo = require("../../../config/mongo");

const mongoDao = new MongoDBCollectionDao(Mongo.oMongoConnection);

async function saveLifeCycles(lifeCycles, mongo = Mongo) {
  /* Object to be used as filter in select */

  const jsonFilter = {
    name: lifeCycles.name,
    type: lifeCycles.type,
    product: lifeCycles.product,
  };

  mongoDao.setURI(mongo.oMongoConnection);
  let result = await mongoDao.update(
    mongo.mongoCollectionProductLifecycleData,
    jsonFilter,
    lifeCycles
  );
  if (!result.result) {
    result = await mongoDao.insertOne(
      mongo.mongoCollectionProductLifecycleData,
      lifeCycles
    );
  }

  return result;
}

async function getLifeCycles(lifeCycles, mongo = Mongo) {
  const jsonFilter = {
    name: lifeCycles.name,
    type: lifeCycles.type,
    product: lifeCycles.product,
  };
  mongoDao.setURI(mongo.oMongoConnection);
  return mongoDao.find(mongo.mongoCollectionProductLifecycleData, jsonFilter);
}

module.exports = {
  saveLifeCycles,
  getLifeCycles,
};
