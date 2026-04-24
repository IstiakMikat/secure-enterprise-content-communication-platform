const auditRepository = require("../repositories/auditRepository");

class AuditService {
  log(payload) {
    return auditRepository.create(payload);
  }
}

module.exports = new AuditService();

