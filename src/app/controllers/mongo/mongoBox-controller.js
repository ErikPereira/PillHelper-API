/* eslint-disable no-console */
const MongoDBCollectionDao = require("pill-helper-sdk/src/app/infra/mongodb/mongo-collection-dao");
const Mongo = require("../../../config/mongo");
const utils = require("../../utils/pillhelper-utils");

const mongoDao = new MongoDBCollectionDao(Mongo.oMongoConnection);

async function insertOneBox(box, mongo = Mongo) {
  try {
    mongoDao.setURI(mongo.oMongoConnection);
    const response = await mongoDao.insertOne(mongo.mongoCollectionBox, box);
    utils.checkHasError(response);

    return { ...response, idBox: box.idBox };
  } catch (err) {
    const res = utils.checkError(err);
    console.log(`[mongoBox-controller.getLoginBox] ${res.msgError}`);
    throw res;
  }
}

async function getOneBox(idBox, mongo = Mongo) {
  try {
    const jsonFilter = [
      {
        $match: {
          idBox,
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
    utils.checkNotFound(response.result, "idBox unknow");

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
      idBox: box.idBox,
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

module.exports = {
  insertOneBox,
  updateBox,
  getAllBox,
  getOneBox,
};
