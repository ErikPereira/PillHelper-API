/* eslint-disable no-console */
const { v4: uuidv4 } = require("uuid");
const { encode } = require("js-base64");
const MongoDBCollectionDao = require("pill-helper-sdk/src/app/infra/mongodb/mongo-collection-dao");
const Mongo = require("../../../config/mongo");
const utils = require("../../utils/pillhelper-utils");

const mongoDao = new MongoDBCollectionDao(Mongo.oMongoConnection);

async function insertOneUser(credentials, mongo = Mongo) {
  const login = credentials;
  login.password = encode(login.password);
  try {
    const user = {
      uuid: uuidv4(),
      alarms: [],
      box: [],
      pharmaceuticals: [],
      login,
    };

    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.insertOne(mongo.mongoCollectionUser, user);
    utils.checkHasError(response);

    return { ...response, uuid: user.uuid };
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoUser-controller.insertOneUser] ${res.msgError}`);
    throw res;
  }
}

async function getOneUser(uuid, mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $match: {
          uuid,
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
      mongo.mongoCollectionUser,
      jsonFilter
    );

    utils.checkHasError(response);
    utils.checkNotFound(response.result, "User");

    return response.result[0];
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoUser-controller.getOneUser] ${res.msgError}`);
    throw res;
  }
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
    console.log(`[mongoUser-controller.getAllUser] ${res.msgError}`);
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
    console.log(`[mongoUser-controller.getLoginUser] ${res.msgError}`);
    throw res;
  }
}

async function updateUser(user, mongo = Mongo) {
  try {
    const jsonFilter = {
      uuid: user.uuid,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.update(
      mongo.mongoCollectionUser,
      jsonFilter,
      user
    );

    utils.checkHasError(response);
    utils.checkUpdateFail(response.result);
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoUser-controller.updateUser] ${res.msgError}`);
    throw res;
  }
}

module.exports = {
  insertOneUser,
  getLoginUser,
  updateUser,
  getAllUser,
  getOneUser,
};
