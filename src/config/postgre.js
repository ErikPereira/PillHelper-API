module.exports = {
  oPostgresConnection: {
    user: process.env.POSTGRE_USER,
    host: process.env.POSTGRE_HOST,
    database: process.env.POSTGRE_DB,
    password: process.env.POSTGRE_PASSWORD,
    port: process.env.POSTGRE_PORT,
  },
  DIFFERENCE_BETWEEN_ATTEMP_AND_EXTRACTION:
    process.env.DIFFERENCE_BETWEEN_ATTEMP_AND_EXTRACTION,
  language: process.env.LANGUAGE,
  timezone: process.env.TIME_ZONE,
};
