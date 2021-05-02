const { v4: uuid } = require("uuid");
const { encode } = require("js-base64");

class CollectorResponse {
  constructor({ body, error, requestID, startedAt, endedAt, status } = {}) {
    this.request_id = requestID || uuid();
    this.stdout = body ? encode(JSON.stringify(body)) : encode("");
    this.stderr = error || "";
    this.started_at = startedAt || "";
    this.ended_at = endedAt || "";
    this.status = status || "";
  }

  get body() {
    return {
      request_id: this.request_id,
      stdout: this.stdout,
      stderr: this.stderr,
      started_at: this.started_at,
      ended_at: this.ended_at,
      status: this.status,
    };
  }
}
module.exports = CollectorResponse;
