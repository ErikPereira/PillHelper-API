db.auth("admin", "admin");

db = db.getSiblingDB("pillHelperbd");

db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [
    {
      role: "dbOwner",
      db: "pillHelperbd",
    },
  ],
});

db.createCollection("User");
db.createCollection("Box");
db.createCollection("Pharmaceutical");
