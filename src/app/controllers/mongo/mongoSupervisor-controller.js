/* eslint-disable no-console */
const { v4: uuidv4 } = require("uuid");
const { encode } = require("js-base64");
const MongoDBCollectionDao = require("pill-helper-sdk/src/app/infra/mongodb/mongo-collection-dao");
const Mongo = require("../../../config/mongo");
const utils = require("../../utils/pillhelper-utils");

const mongoDao = new MongoDBCollectionDao(Mongo.oMongoConnection);

async function insertOneSupervisor(credentials, mongo = Mongo) {
  const login = credentials;
  login.password = encode(login.password);

  try {
    const supervisor = {
      uuidSupervisor: uuidv4(),
      users: [],
      bulla: [],
      login,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.insertOne(
      mongo.mongoCollectionSupervisor,
      supervisor
    );
    utils.checkHasError(response);

    return {
      ...response,
      uuidSupervisor: supervisor.uuidSupervisor,
    };
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoSupervisor-controller.insertOneSupervisor] ${res.msgError}`
    );
    throw res;
  }
}

async function getOneSupervisor(uuidSupervisor, mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $match: {
          uuidSupervisor,
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
      mongo.mongoCollectionSupervisor,
      jsonFilter
    );

    utils.checkHasError(response);
    utils.checkNotFound(response.result, "Supervisor");

    return response.result[0];
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoSupervisor-controller.getOneSupervisor] ${res.msgError}`
    );
    throw res;
  }
}

async function getAllSupervisor(mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $project: {
          _id: 0,
        },
      },
    ];

    const response = await mongoDao.aggregate(
      mongo.mongoCollectionSupervisor,
      jsonFilter
    );
    utils.checkHasError(response);
    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoSupervisor-controller.getAllSupervisor] ${res.msgError}`
    );
    throw res;
  }
}

async function updateSupervisor(supervisor, mongo = Mongo) {
  try {
    const jsonFilter = {
      uuidSupervisor: supervisor.uuidSupervisor,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.update(
      mongo.mongoCollectionSupervisor,
      jsonFilter,
      supervisor
    );

    utils.checkHasError(response);
    utils.checkUpdateFail(response.result);
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoSupervisor-controller.updateSupervisor] ${res.msgError}`
    );
    throw res;
  }
}

async function getLoginSupervisor(mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $project: {
          _id: 0,
          uuidSupervisor: 1,
          login: 1,
        },
      },
    ];

    const response = await mongoDao.aggregate(
      mongo.mongoCollectionSupervisor,
      jsonFilter
    );
    utils.checkHasError(response);
    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoSupervisor-controller.getLoginSupervisor] ${res.msgError}`
    );
    throw res;
  }
}

async function deleteOneSupervisor(uuidSupervisor, mongo = Mongo) {
  try {
    const jsonFilter = {
      uuidSupervisor,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.deleteOne(
      mongo.mongoCollectionSupervisor,
      jsonFilter
    );

    utils.checkHasError(response);

    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(
      `[mongoSupervisor-controller.deleteOneSupervisor] ${res.msgError}`
    );
    throw res;
  }
}

module.exports = {
  insertOneSupervisor,
  deleteOneSupervisor,
  getLoginSupervisor,
  updateSupervisor,
  getAllSupervisor,
  getOneSupervisor,
};
