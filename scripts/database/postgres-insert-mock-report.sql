INSERT INTO metadata_collectors (collector, params, product, os, release_version, collect_type, is_sync, endpoint)
values
	(
		'lifecycle-collector', 
		'{"header":{"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZpcm9ubWVudCI6ImRldiJ9.53sPOQjrtzKohY0kMWETGX8_aZLSf0mm_I-JITatKvc"},"urlQuery":"type=type&product=product&app=null&version=undefined"}',
		'mssql',
		'',
		'',
		'HTTP-GET',
		true,
		'http://192.68.160.14:????/getLifecycle'
	);

INSERT INTO collector_lifecycle_params ("name", "type", product, "version", app, url, username, "password", table_index, table_mapping, "result", "target", last_attempt_date, last_extraction_date)
VALUES(
	'SQL Server', 
	'type', 
	'product', 
	'version', 
	NULL, 
	'https://docs.microsoft.com/sql/sql-server/end-of-support/sql-server-end-of-life-overview?view=sql-server-ver15#lifecycle-dates',
	NULL, 
	NULL, 
	0, 
	'{
	  "mappingType": "direct",
	  "columnMapping": [
	    {
	      "origName": "Version",
	      "normName": "version"
	    },
	    {
	      "origName": "Release year",
	      "normName": "release"
	    },
	    {
	      "origName": "Mainstream Support end year",
	      "normName": "mainSupEnd"
	    },
	    {
	      "origName": "Extended Support end year",
	      "normName": "extSupEnd"
	    }
	  ]
	}', 
	NULL,
	'HTML',
	NULL, 
	NULL
);

INSERT INTO collector_lifecycle_params ("name", "type", product, "version", app, url, username, "password", table_index, table_mapping, "result", "target", last_attempt_date, last_extraction_date)
VALUES(
	'SQL Server 2', 
	'type', 
	'product', 
	'version', 
	NULL, 
	'https://docs.microsoft.com/sql/sql-server/end-of-support/sql-server-end-of-life-overview?view=sql-server-ver15#lifecycle-dates',
	NULL, 
	NULL, 
	0, 
	'{
	  "mappingType": "direct",
	  "columnMapping": [
	    {
	      "origName": "Version",
	      "normName": "version"
	    },
	    {
	      "origName": "Release year",
	      "normName": "release"
	    },
	    {
	      "origName": "Mainstream Support end year",
	      "normName": "mainSupEnd"
	    },
	    {
	      "origName": "Extended Support end year",
	      "normName": "extSupEnd"
	    }
	  ]
	}', 
	NULL,
	'HTML',
	'2021-04-20 14:54:12', 
	'2021-04-20 14:54:12'
);

INSERT INTO collector_lifecycle_params ("name", "type", product, "version", app, url, username, "password", table_index, table_mapping, "result", "target", last_attempt_date, last_extraction_date)
VALUES(
	'Discrepancy', 
	'type', 
	'product', 
	'version', 
	NULL, 
	'https://docs.microsoft.com/sql/sql-server/end-of-support/sql-server-end-of-life-overview?view=sql-server-ver15#lifecycle-dates',
	NULL, 
	NULL, 
	0, 
	'{
	  "mappingType": "direct",
	  "columnMapping": [
	    {
	      "origName": "Extended Support end year",
	      "normName": "extSupEnd"
	    }
	  ]
	}', 
	NULL,
	'HTML',
	NULL, 
	NULL
);

INSERT INTO collector_lifecycle_params ("name", "type", product, "version", app, url, username, "password", table_index, table_mapping, "result", "target", last_attempt_date, last_extraction_date)
VALUES(
	'TimeOut', 
	'type', 
	'product', 
	'version', 
	NULL, 
	'http://gitlab.brhsa.equinix.com:8888/icarotech/environment-analysis/back-end/metadata-gatherer-w/-/pipelines/2366',
	NULL, 
	NULL, 
	0, 
	'{
	  "mappingType": "direct",
	  "columnMapping": [
	    {
	      "origName": "Version",
	      "normName": "version"
	    },
	    {
	      "origName": "Release year",
	      "normName": "release"
	    },
	    {
	      "origName": "Mainstream Support end year",
	      "normName": "mainSupEnd"
	    },
	    {
	      "origName": "Extended Support end year",
	      "normName": "extSupEnd"
	    }
	  ]
	}', 
	NULL,
	'HTML',
	NULL, 
	NULL
);

INSERT INTO collector_lifecycle_params ("name", "type", product, "version", app, url, username, "password", table_index, table_mapping, "result", "target", last_attempt_date, last_extraction_date)
VALUES(
	'Err', 
	'type', 
	'product', 
	'version', 
	NULL, 
	'http://youtube.com',
	NULL, 
	NULL, 
	0, 
	'{
	  "mappingType": "direct",
	  "columnMapping": [
	    {
	      "origName": "Version",
	      "normName": "version"
	    },
	    {
	      "origName": "Release year",
	      "normName": "release"
	    },
	    {
	      "origName": "Mainstream Support end year",
	      "normName": "mainSupEnd"
	    },
	    {
	      "origName": "Extended Support end year",
	      "normName": "extSupEnd"
	    }
	  ]
	}', 
	NULL,
	'HTML',
	NULL, 
	NULL
);

INSERT INTO collector_lifecycle_params ("name", "type", product, "version", app, url, username, "password", table_index, table_mapping, "result", "target", last_attempt_date, last_extraction_date)
VALUES(
	'Red Hat Enterprise Linux', 
	'type', 
	'product', 
	'version', 
	NULL, 
	'https://access.redhat.com/product-life-cycles/api/v1/products?name=Red%20Hat%20Enterprise%20Linux',
	NULL, 
	NULL, 
	0, 
	'{
	  "mappingType": "indirect",
	  "columnMapping": [
	    {
	      "origName": "Version",
	      "normName": "version"
	    },
	    {
	      "origName": "Release year",
	      "normName": "release"
	    },
	    {
	      "origName": "Mainstream Support end year",
	      "normName": "mainSupEnd"
	    },
	    {
	      "origName": "Extended Support end year",
	      "normName": "extSupEnd"
	    }
	  ]
	}', 
	NULL,
	'API',
	NULL, 
	NULL
);