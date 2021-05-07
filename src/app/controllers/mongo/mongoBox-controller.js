/* eslint-disable no-console */
const { v4: uuidv4 } = require("uuid");
const MongoDBCollectionDao = require("pill-helper-sdk/src/app/infra/mongodb/mongo-collection-dao");
const Mongo = require("../../../config/mongo");
const utils = require("../../utils/pillhelper-utils");

const mongoDao = new MongoDBCollectionDao(Mongo.oMongoConnection);

async function insertOneBox(mongo = Mongo) {
  try {
    const box = {
      uuidBox: uuidv4(),
      uuidUser: "",
      nameBox: "",
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.insertOne(mongo.mongoCollectionBox, box);
    utils.checkHasError(response);

    return { ...response, uuidBox: box.uuidBox };
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBox-controller.getLoginBox] ${res.msgError}`);
    throw res;
  }
}

async function getOneBox(uuidBox, mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $match: {
          uuidBox,
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
      mongo.mongoCollectionBox,
      jsonFilter
    );

    utils.checkHasError(response);
    utils.checkNotFound(response.result, "Box");

    return response.result[0];
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBox-controller.getLoginBox] ${res.msgError}`);
    throw res;
  }
}

async function getAllBox(mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $project: {
          _id: 0,
        },
      },
    ];

    const response = await mongoDao.aggregate(
      mongo.mongoCollectionBox,
      jsonFilter
    );
    utils.checkHasError(response);
    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBox-controller.getAllBox] ${res.msgError}`);
    throw res;
  }
}

async function updateBox(box, mongo = Mongo) {
  try {
    const jsonFilter = {
      uuidBox: box.uuidBox,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.update(
      mongo.mongoCollectionBox,
      jsonFilter,
      box
    );

    utils.checkHasError(response);
    utils.checkUpdateFail(response.result);
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBox-controller.updateBox] ${res.msgError}`);
    throw res;
  }
}

async function deleteOneBox(uuidBox, mongo = Mongo) {
  try {
    const jsonFilter = {
      uuidBox,
    };
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.deleteOne(
      mongo.mongoCollectionBox,
      jsonFilter
    );

    utils.checkHasError(response);

    return response.result;
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBox-controller.deleteOneBox] ${res.msgError}`);
    throw res;
  }
}

module.exports = {
  insertOneBox,
  deleteOneBox,
  updateBox,
  getAllBox,
  getOneBox,
};
