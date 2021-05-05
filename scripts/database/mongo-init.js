const mongo = require("../../src/config/mongo");
const dbName = mongo.oMongoConnection.mongoDBdb;

db.auth("admin", "admin");

db = db.getSiblingDB(dbName);

db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [
    {
      role: "dbOwner",
      db: dbName,
    },
  ],
});

db.createCollection(mongo.mongoCollectionUser);
db.createCollection(mongo.mongoCollectionBox);
db.createCollection(mongo.mongoCollectionPharmaceutical);
