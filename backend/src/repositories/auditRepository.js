const BaseRepository = require("./BaseRepository");
const AuditLog = require("../models/AuditLog");

class AuditRepository extends BaseRepository {
  constructor() {
    super(AuditLog);
  }
}

module.exports = new AuditRepository();

