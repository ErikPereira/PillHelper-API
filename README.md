# Life Cycle
This project is part of the collector of Equinix's Environment Analysis Reports Automation.
For other APIs and workers, check the automation's [collector repository](http://201.20.39.67:8888/icarotech/environment-analysis/collectors).

This project aims to collect information about the life cycle of systems, store them in Mongo and return via endpoint.
## Technical Requirements and Installation

This API requires an instance of PostgreSQL and MongoDB running.

To do this, use the `docker-compose up` command.

## How it Works
The API currently provides endpoints that allow you to search for systems lifecycle information through information stored in Postgre's **metadata_collectors** and **collector_lifecycle_params** tables.

To make it easier, all the terminals currently developed will be in sequence.

## Endpoints Get
*  `/getLifecycle`: at first, the endpoint fetches the information in the Postgre **metadata_collectors** table, looking for `collector = 'lifecycle-collector'` because in this register the data `type`, `product`, `app` and `version` are stored inside of params. These 4 data will be used to create a query to consult the table **collector_lifecycle_params** being able to identify which systems to be searched for. For each result found in the table **collector_lifecycle_params** a personalized query is performed, being able to use **Pandas** in Python if it is HTML or **Axios** if it is API.
Finishing the whole process, the API return follows the following pattern, where the result is found in the `stdout` field converted to base64:
```JSON
[
    {
    "request_id": "{{ request_id }}",
    "stdout": "{{<base64> }}",
    "stderr": "{{ stderr }}",
    "started_at": "{{ started_at }}",
    "ended_at": "{{ ended_at }}",
    "status": "{{ status }}"
}
]
```

## Data entered in the Mongo
After carrying out all the work of searching and processing information, the data that is stored in the mongo differs slightly from that returned by the endpoint, seeking to maintain a backup to be used at times when the project identifies some type of error during its execution. . The following is an example of data stored in the mongo:
```JSON
{
  "name": "{{ name }}",
  "type": "{{ type }}",
  "product": "{{ product }}",
  "app": "{{ app }}",
  "version": "{{ version }}",
  "lifecycle": {...}
}
```
The `lifecycle` field corresponds exactly to the data returned by the `/getLifecycle` endpoint.

 ## Usage
First, make sure that the Mongo and Postgre docker are running correctly and already have initial information. If wanted to know what these initial data would look like, check the file `/scripts/database/postgres-insert-mock-report.sql` and the file `/__tests__\unit\mock.js`.
Done, just use the command `npm run dev` that the API will be running on port 3000. With that, the endpoints will be available.


