const express = require("express");
const controller = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/rbacMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/company-overview", allowRoles("ADMIN", "MANAGER"), controller.companyOverview);
router.get(
  "/employee-performance",
  allowRoles("ADMIN", "MANAGER"),
  controller.employeePerformance
);
router.get(
  "/department-overview",
  allowRoles("ADMIN", "MANAGER"),
  controller.departmentOverview
);
router.get("/security-overview", allowRoles("ADMIN"), controller.securityOverview);

module.exports = router;

