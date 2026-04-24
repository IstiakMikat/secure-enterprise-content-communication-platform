const AuditLog = require("../../models/AuditLog");
const IntegrityAlert = require("../../models/IntegrityAlert");
const analyticsService = require("../analyticsService");

class LogAdminService {
  audit() {
    return AuditLog.find().populate("actorId").sort({ createdAt: -1 }).limit(200);
  }

  integrityAlerts() {
    return IntegrityAlert.find().sort({ createdAt: -1 }).limit(200);
  }

  securitySummary() {
    return analyticsService.getSecurityOverview();
  }
}

module.exports = new LogAdminService();

