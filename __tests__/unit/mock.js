const postgresUtil = require("sdk-utils-module/src/utils/postgres");

function axiosMock() {
  return {
    data: [
      {
        name: "Red Hat Enterprise Linux",
        show_last_minor_release: true,
        is_layered_product: false,
        link: "https://access.redhat.com/site/support/policy/updates/errata/",
        versions: [
          {
            name: "7",
            type: "Maintenance Support",
            last_minor_release: "7.9",
            extra_header_value: null,
            phases: [
              {
                name: "General availability",
                date: "2014-06-10T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Full support",
                date: "2019-08-06T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support 1",
                date: "2020-08-06T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support or Maintenance Support 2",
                date: "2024-06-30T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life cycle support (ELS) add-on",
                date: "2026-06-30T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life phase",
                date: "Ongoing",
                date_format: "string",
              },
            ],
          },
          {
            name: "7 (System z (Structure A))",
            type: "Maintenance Support",
            last_minor_release: "7.6",
            extra_header_value: null,
            phases: [
              {
                name: "General availability",
                date: "2018-04-10T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Full support",
                date: "2019-08-06T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support 1",
                date: "2020-08-06T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support or Maintenance Support 2",
                date: "2021-05-31T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life cycle support (ELS) add-on",
                date: "Not Applicable",
                date_format: "string",
              },
              {
                name: "Extended life phase",
                date: "Ongoing",
                date_format: "string",
              },
            ],
          },
          {
            name: "7 (ARM)",
            type: "End of Maintenance",
            last_minor_release: "7.6",
            extra_header_value: null,
            phases: [
              {
                name: "General availability",
                date: "2017-11-13T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Full support",
                date: "2019-08-06T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support 1",
                date: "2020-08-06T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support or Maintenance Support 2",
                date: "2020-11-30T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life cycle support (ELS) add-on",
                date: "Not Applicable",
                date_format: "string",
              },
              {
                name: "Extended life phase",
                date: "Ongoing",
                date_format: "string",
              },
            ],
          },
          {
            name: "7 (POWER9)",
            type: "Maintenance Support",
            last_minor_release: "7.6",
            extra_header_value: null,
            phases: [
              {
                name: "General availability",
                date: "2017-11-13T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Full support",
                date: "2019-08-06T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support 1",
                date: "2020-08-06T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support or Maintenance Support 2",
                date: "2021-05-31T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life cycle support (ELS) add-on",
                date: "Not Applicable",
                date_format: "string",
              },
              {
                name: "Extended life phase",
                date: "Ongoing",
                date_format: "string",
              },
            ],
          },
          {
            name: "6",
            type: "End of Maintenance",
            last_minor_release: "6.10",
            extra_header_value: null,
            phases: [
              {
                name: "General availability",
                date: "2010-11-10T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Full support",
                date: "2016-05-10T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support 1",
                date: "2017-05-10T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support or Maintenance Support 2",
                date: "2020-11-30T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life cycle support (ELS) add-on",
                date: "2024-06-30T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life phase",
                date: "Ongoing",
                date_format: "string",
              },
            ],
          },
          {
            name: "4",
            type: "End of Maintenance",
            last_minor_release: "4.9",
            extra_header_value: null,
            phases: [
              {
                name: "General availability",
                date: "2005-02-14T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Full support",
                date: "2009-03-31T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support 1",
                date: "2011-02-16T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support or Maintenance Support 2",
                date: "2012-02-29T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life cycle support (ELS) add-on",
                date: "2017-03-31T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life phase",
                date: "Ongoing",
                date_format: "string",
              },
            ],
          },
          {
            name: "5",
            type: "End of Maintenance",
            last_minor_release: "5.11",
            extra_header_value: null,
            phases: [
              {
                name: "General availability",
                date: "2007-03-15T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Full support",
                date: "2013-01-08T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support 1",
                date: "2014-01-31T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support or Maintenance Support 2",
                date: "2017-03-31T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life cycle support (ELS) add-on",
                date: "2020-11-30T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life phase",
                date: "Ongoing",
                date_format: "string",
              },
            ],
          },
          {
            name: "8",
            type: "Full Support",
            last_minor_release: "8.10",
            extra_header_value: null,
            phases: [
              {
                name: "General availability",
                date: "2019-05-07T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Full support",
                date: "2024-05-31T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Maintenance Support 1",
                date: "Not Applicable",
                date_format: "string",
              },
              {
                name: "Maintenance Support or Maintenance Support 2",
                date: "2029-05-31T00:00:00.000Z",
                date_format: "date",
              },
              {
                name: "Extended life cycle support (ELS) add-on",
                date: "TBD",
                date_format: "string",
              },
              {
                name: "Extended life phase",
                date: "TBD",
                date_format: "string",
              },
            ],
          },
        ],
        all_phases: [
          {
            name: "General availability",
            display_name: "General availability",
          },
          {
            name: "Full support",
            display_name: "Full support ends",
          },
          {
            name: "Maintenance Support 1",
            display_name: "Maintenance Support 1 ends",
          },
          {
            name: "Maintenance Support or Maintenance Support 2",
            display_name: "Maintenance Support or Maintenance Support 2 ends",
          },
          {
            name: "Extended life cycle support (ELS) add-on",
            display_name: "Extended life cycle support (ELS) add-on ends",
          },
          {
            name: "Extended life phase",
            display_name: "Extended life phase ends",
          },
        ],
      },
    ],
  };
}

function mongoMock() {
  const array = [];
  array.push(
    {
      name: "SQL Server",
      type: "type",
      product: "product",
      app: null,
      version: "version",
      lifecycle: [
        {
          version: "SQL Server 2019",
          release: 2019,
          mainSupEnd: 2025,
          extSupEnd: 2030,
        },
        {
          version: "SQL Server 2017",
          release: 2017,
          mainSupEnd: 2022,
          extSupEnd: 2027,
        },
        {
          version: "SQL Server 2016",
          release: 2016,
          mainSupEnd: 2021,
          extSupEnd: 2026,
        },
        {
          version: "SQL Server 2014",
          release: 2014,
          mainSupEnd: 2019,
          extSupEnd: 2024,
        },
        {
          version: "SQL Server 2012",
          release: 2012,
          mainSupEnd: 2017,
          extSupEnd: 2022,
        },
        {
          version: "SQL Server 2008 R2",
          release: 2010,
          mainSupEnd: 2012,
          extSupEnd: 2019,
        },
        {
          version: "SQL Server 2008",
          release: 2008,
          mainSupEnd: 2012,
          extSupEnd: 2019,
        },
        {
          version: "SQL Server 2005",
          release: 2006,
          mainSupEnd: 2011,
          extSupEnd: 2016,
        },
        {
          version: "SQL Server 2000",
          release: 2000,
          mainSupEnd: 2005,
          extSupEnd: 2013,
        },
      ],
    },
    {
      name: "Discrepancy",
      type: "type",
      product: "product",
      app: null,
      version: "version",
      lifecycle: [
        {
          teste: "Discrepancy",
        },
      ],
    },
    {
      name: "TimeOut",
      type: "type",
      product: "product",
      app: null,
      version: "version",
      lifecycle: [
        {
          teste: "TimeOut",
        },
      ],
    },
    {
      name: "Err",
      type: "type",
      product: "product",
      app: null,
      version: "version",
      lifecycle: [
        {
          teste: "Err",
        },
      ],
    },
    {
      name: "Red Hat Enterprise Linux",
      type: "type",
      product: "product",
      app: null,
      version: "version",
      lifecycle: [
        {
          teste: "Red Hat Enterprise Linux",
        },
      ],
    }
  );

  return array;
}

function expectedReturn() {
  return {
    lifecycle: [
      {
        version: "SQL Server 2019",
        release: 2019,
        mainSupEnd: 2025,
        extSupEnd: 2030,
      },
      {
        version: "SQL Server 2017",
        release: 2017,
        mainSupEnd: 2022,
        extSupEnd: 2027,
      },
      {
        version: "SQL Server 2016",
        release: 2016,
        mainSupEnd: 2021,
        extSupEnd: 2026,
      },
      {
        version: "SQL Server 2014",
        release: 2014,
        mainSupEnd: 2019,
        extSupEnd: 2024,
      },
      {
        version: "SQL Server 2012",
        release: 2012,
        mainSupEnd: 2017,
        extSupEnd: 2022,
      },
      {
        version: "SQL Server 2008 R2",
        release: 2010,
        mainSupEnd: 2012,
        extSupEnd: 2019,
      },
      {
        version: "SQL Server 2008",
        release: 2008,
        mainSupEnd: 2012,
        extSupEnd: 2019,
      },
      {
        version: "SQL Server 2005",
        release: 2006,
        mainSupEnd: 2011,
        extSupEnd: 2016,
      },
      {
        version: "SQL Server 2000",
        release: 2000,
        mainSupEnd: 2005,
        extSupEnd: 2013,
      },
      {
        teste: "Discrepancy",
      },
      {
        teste: "TimeOut",
      },
      {
        teste: "Err",
      },
      {
        teste: "Red Hat Enterprise Linux",
      },
    ],
  };
}

async function resetPostgres(pgConn) {
  // Drop all tables if they exist
  await postgresUtil.execScript(
    pgConn,
    "./node_modules/sdk-utils-module/scripts/database/postgres-drop-tables.sql"
  );
  // Re-create all tables
  const result = await postgresUtil.execScript(
    pgConn,
    "./node_modules/sdk-utils-module/scripts/database/postgres-create-tables.sql"
  );
  if (result.hasError) {
    throw new Error(result.msgError);
  }

  await postgresUtil.execScript(
    pgConn,
    "./scripts/database/postgres-insert-mock-report.sql"
  );
}
module.exports = {
  mongoMock,
  axiosMock,
  resetPostgres,
  expectedReturn,
};
