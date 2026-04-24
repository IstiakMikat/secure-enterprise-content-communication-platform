const express = require("express");
const controller = require("../../controllers/admin/logAdminController");

const router = express.Router();

router.get("/audit", controller.audit);
router.get("/integrity-alerts", controller.integrityAlerts);
router.get("/security-summary", controller.securitySummary);

module.exports = router;

