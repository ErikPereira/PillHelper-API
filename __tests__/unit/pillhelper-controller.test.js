require("../../src/config/env-config");
const supertest = require("supertest");
const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

const MongoDBCollectionDao = require("pill-helper-sdk/src/app/infra/mongodb/mongo-collection-dao");

const mock = require("./mock");
const app = require("../../src/config/custom-express");
const mongo = require("../../src/config/mongo");
const mongoController = require("../../src/app/controllers/mongo/mongo-controller");

const request = supertest(app);

const validJwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjpudWxsLCJzeXN0ZW0iOiJsaWZlY3ljbGVDb250cm9sbGVyIn0.-swHY0LOYCWvzsij4PaO-aIthtjfblv770qDv7rsN_E";

const invalidJwtToken = "invalidJwtToken";

let mongoConn;

jest.mock("axios");

describe("Requester Controller", () => {
  beforeAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500));
    // avoid jest rushing into tests without completing insertion on db

    mongoConn = new MongoDBCollectionDao(mongo.oMongoConnection);
    await mongoConn.createCollection(mongo.mongoCollectionProductLifecycleData);
    await mongoConn.insertMany(
      mongo.mongoCollectionProductLifecycleData,
      mock.mongoMock()
    );

    axios.get = jest.fn();
    axios.mockImplementation(mock.axiosMock);
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500));
    await mongoConn.dropCollection(mongo.mongoCollectionProductLifecycleData);
  });

  describe("endpoint getLifecycle", () => {
    it("getLifecycle invalid token", async () => {
      const result = await request
        .get(`/getLifecycle?type=type&product=product`)
        .auth(invalidJwtToken, { type: "bearer" })
        .set("Accept", "application/json");

      expect(result).toEqual("Invalid JWT Token");
    });

    it("getLifecycle Nont Found", async () => {
      const result = await request
        .get(`/getLifecycle?type=test&product=test`)
        .auth(validJwtToken, { type: "bearer" })
        .set("Accept", "application/json");

      expect(result).toEqual("Not Found - Postgre, collectorLifeCycleParams");
      expect(result.status).toEqual(StatusCodes.NOT_FOUND);
    });

    it("getLifecycle 500", async () => {
      const result = await request
        .get(`/getLifecycle/`)
        .auth(validJwtToken, { type: "bearer" })
        .set("Accept", "application/json");

      expect(result).toEqual('syntax error at or near ";"');
      expect(result.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("mongo Controller", () => {
    it("saveLifeCycles insert", async () => {
      const lifecycle = mock.mongoMock()[0];
      lifecycle.name = "forTest";
      lifecycle.lifecycle = {};
      const result = await mongoController.saveLifeCycles(lifecycle);

      expect(result.hasError).toEqual(false);
      expect(result.msgError).toEqual("");
    });

    it("saveLifeCycles update", async () => {
      const result = await mongoController.saveLifeCycles(mock.mongoMock()[0]);

      expect(result.hasError).toEqual(false);
      expect(result.msgError).toEqual("");
      expect(result.result).toEqual(1);
    });
  });
});
