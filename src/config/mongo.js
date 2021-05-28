module.exports = {
  oMongoConnection: {
    mongoDBUser: process.env.MONGO_USER,
    mongoDBPass: process.env.MONGO_PASSWORD,
    mongoDBURL: process.env.MONGO_URL,
    mongoDBdb: process.env.MONGO_DB,
    mongoDBAuthSource: process.env.MONGO_AUTH,
  },
  mongoCollectionUser: process.env.MONGO_COLLECTION_USER,
  mongoCollectionBox: process.env.MONGO_COLLECTION_BOX,
  mongoCollectionSupervisor: process.env.MONGO_COLLECTION_SUPERVISOR,
};
