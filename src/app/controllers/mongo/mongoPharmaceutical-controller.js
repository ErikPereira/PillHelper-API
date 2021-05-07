/* eslint-disable no-console */
const { v4: uuidv4 } = require("uuid");
const { encode } = require("js-base64");
const MongoDBCollectionDao = require("pill-helper-sdk/src/app/infra/mongodb/mongo-collection-dao");
const Mongo = require("../../../config/mongo");
const utils = require("../../utils/pillhelper-utils");

const mongoDao = new MongoDBCollectionDao(Mongo.oMongoConnection);

async function insertOnePharmaceutical(credentials, mongo = Mongo) {
  const login = credentials;
  login.password = encode(login.password);
  try {
    const pharmaceutical = {
      uuidPhar: uuidv4(),
      users: [],
      login,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.insertOne(
      mongo.mongoCollectionPharmaceutical,
      pharmaceutical
    );
    utils.checkHasError(response);

    return {
      ...response,
      uuidPhar: pharmaceutical.uuidPhar,
    };
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoPharmaceutical-controller.insertOnePharmaceutical] ${res.msgError}`
    );
    throw res;
  }
}

async function getOnePharmaceutical(uuidPhar, mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $match: {
          uuidPhar,
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
      mongo.mongoCollectionPharmaceutical,
      jsonFilter
    );

    utils.checkHasError(response);
    utils.checkNotFound(response.result, "Pharmaceutical");

    return response.result[0];
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoPharmaceutical-controller.getOnePharmaceutical] ${res.msgError}`
    );
    throw res;
  }
}

async function getAllPharmaceutical(mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $project: {
          _id: 0,
        },
      },
    ];

    const response = await mongoDao.aggregate(
      mongo.mongoCollectionPharmaceutical,
      jsonFilter
    );
    utils.checkHasError(response);
    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoPharmaceutical-controller.getAllPharmaceutical] ${res.msgError}`
    );
    throw res;
  }
}

async function updatePharmaceutical(pharmaceutical, mongo = Mongo) {
  try {
    const jsonFilter = {
      uuidPhar: pharmaceutical.uuidPhar,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.update(
      mongo.mongoCollectionPharmaceutical,
      jsonFilter,
      pharmaceutical
    );

    utils.checkHasError(response);
    utils.checkUpdateFail(response.result);
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoPharmaceutical-controller.updatePharmaceutical] ${res.msgError}`
    );
    throw res;
  }
}

async function getLoginPharmaceutical(mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $project: {
          _id: 0,
          uuidPhar: 1,
          login: 1,
        },
      },
    ];

    const response = await mongoDao.aggregate(
      mongo.mongoCollectionPharmaceutical,
      jsonFilter
    );
    utils.checkHasError(response);
    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoPharmaceutical-controller.getLoginPharmaceutical] ${res.msgError}`
    );
    throw res;
  }
}

async function deleteOnePharmaceutical(uuidPhar, mongo = Mongo) {
  try {
    const jsonFilter = {
      uuidPhar,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.deleteOne(
      mongo.mongoCollectionPharmaceutical,
      jsonFilter
    );

    utils.checkHasError(response);

    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoPharmaceutical-controller.deleteOnePharmaceutical] ${res.msgError}`
    );
    throw res;
  }
}

module.exports = {
  insertOnePharmaceutical,
  deleteOnePharmaceutical,
  getLoginPharmaceutical,
  updatePharmaceutical,
  getAllPharmaceutical,
  getOnePharmaceutical,
};
