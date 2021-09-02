/* eslint-disable no-console */
const { v4: uuidv4 } = require("uuid");
const MongoDBCollectionDao = require("pill-helper-sdk/src/app/infra/mongodb/mongo-collection-dao");
const Mongo = require("../../../config/mongo");
const utils = require("../../utils/pillhelper-utils");

const mongoDao = new MongoDBCollectionDao(Mongo.oMongoConnection);

async function insertOneBulla(bulla, mongo = Mongo) {
  try {

    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.insertOne(mongo.mongoCollectionBulla, bulla);
    utils.checkHasError(response);

    return response;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBulla-controller.insertOneBulla] ${res.msgError}`);
    throw res;
  }
}

async function insertManyBulla(bulla, mongo = Mongo) {
  try {

    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.insertMany(mongo.mongoCollectionBulla, bulla);
    utils.checkHasError(response);

    return response;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBulla-controller.insertManyBulla] ${res.msgError}`);
    throw res;
  }
}

async function getOneBulla(nameBulla, mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $match: {
          nameBulla,
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.aggregate(
      mongo.mongoCollectionBulla,
      jsonFilter
    );

    utils.checkHasError(response);
    utils.checkNotFound(response.result, "Bulla");

    return response.result[0];
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBulla-controller.getOneBulla] ${res.msgError}`);
    throw res;
  }
}

async function getAllBulla(mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $project: {
          _id: 0,
        },
      },
    ];

    const response = await mongoDao.aggregate(
      mongo.mongoCollectionBulla,
      jsonFilter
    );
    utils.checkHasError(response);
    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBulla-controller.getAllBulla] ${res.msgError}`);
    throw res;
  }
}

async function getAllNameBulla(mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $project: {
          _id: 0,
          nameBulla: 1,
        },
      },
    ];

    const response = await mongoDao.aggregate(
      mongo.mongoCollectionBulla,
      jsonFilter
    );
    utils.checkHasError(response);
    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBulla-controller.getAllBulla] ${res.msgError}`);
    throw res;
  }
}

async function updateBulla(bulla, mongo = Mongo) {
  try {
    const jsonFilter = {
      nameBulla: bulla.nameBulla,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.update(
      mongo.mongoCollectionBulla,
      jsonFilter,
      bulla
    );

    utils.checkHasError(response);
    utils.checkUpdateFail(response.result);
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBulla-controller.updateBulla] ${res.msgError}`);
    throw res;
  }
}

async function deleteOneBulla(nameBulla, mongo = Mongo) {
  try {
    const jsonFilter = {
      nameBulla,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.deleteOne(
      mongo.mongoCollectionBulla,
      jsonFilter
    );

    utils.checkHasError(response);

    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBulla-controller.deleteOneBulla] ${res.msgError}`);
    throw res;
  }
}

module.exports = {
  insertManyBulla,
  getAllNameBulla,
  insertOneBulla,
  deleteOneBulla,
  updateBulla,
  getAllBulla,
  getOneBulla,
};
