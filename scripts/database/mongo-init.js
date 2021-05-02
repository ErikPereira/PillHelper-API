db.auth("admin", "admin");

db = db.getSiblingDB("env_analysis");

db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [
    {
      role: "dbOwner",
      db: "env_analysis",
    },
  ],
});

db.createCollection("metadata");
db.createCollection("collector_object");
db.createCollection("collected_data");
db.createCollection("processed_data");
db.createCollection("reports");
db.createCollection("collector_template");
db.createCollection("sn_client_configuration_items");
db.createCollection("analysis");

