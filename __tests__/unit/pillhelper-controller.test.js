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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGV2Iiwic3lzdGVtIjoiQVBJIn0.6lrvVMtHdb6P5f-Au4c36SK1OT8kb0_gg5BuEok_TpU";

const invalidJwtToken = "invalidJwtToken";

let mongoConn;

jest.mock("axios");

describe("Requester Controller", () => {
  beforeAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500));
    // avoid jest rushing into tests without completing insertion on db

    mongoConn = new MongoDBCollectionDao(mongo.oMongoConnection);
    await mongoConn.createCollection(
      mongo.mongoCollectionProductPillHelperData
    );
    await mongoConn.insertMany(
      mongo.mongoCollectionProductPillHelperData,
      mock.mongoMock()
    );

    axios.get = jest.fn();
    axios.mockImplementation(mock.axiosMock);
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500));
    await mongoConn.dropCollection(mongo.mongoCollectionProductPillHelperData);
  });

  describe("endpoint getPillHelper", () => {
    it("getPillHelper invalid token", async () => {
      const result = await request
        .get(`/getPillHelper?type=type&product=product`)
        .auth(invalidJwtToken, { type: "bearer" })
        .set("Accept", "application/json");

      expect(result).toEqual("Invalid JWT Token");
    });

    it("getPillHelper Nont Found", async () => {
      const result = await request
        .get(`/getPillHelper?type=test&product=test`)
        .auth(validJwtToken, { type: "bearer" })
        .set("Accept", "application/json");

      expect(result).toEqual("Not Found - Postgre, collectorPillHelperParams");
      expect(result.status).toEqual(StatusCodes.NOT_FOUND);
    });

    it("getPillHelper 500", async () => {
      const result = await request
        .get(`/getPillHelper/`)
        .auth(validJwtToken, { type: "bearer" })
        .set("Accept", "application/json");

      expect(result).toEqual('syntax error at or near ";"');
      expect(result.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("mongo Controller", () => {
    it("savePillHelpers insert", async () => {
      const pillHelper = mock.mongoMock()[0];
      pillHelper.name = "forTest";
      pillHelper.pillHelper = {};
      const result = await mongoController.savePillHelpers(pillHelper);

      expect(result.hasError).toEqual(false);
      expect(result.msgError).toEqual("");
    });

    it("savePillHelpers update", async () => {
      const result = await mongoController.savePillHelpers(mock.mongoMock()[0]);

      expect(result.hasError).toEqual(false);
      expect(result.msgError).toEqual("");
      expect(result.result).toEqual(1);
    });
  });
});
