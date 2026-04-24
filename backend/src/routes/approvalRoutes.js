const express = require("express");
const controller = require("../controllers/approvalController");
const authMiddleware = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/rbacMiddleware");

const router = express.Router();

router.use(authMiddleware, allowRoles("ADMIN", "MANAGER"));
router.get("/pending", controller.getPending);
router.post("/:id/approve", controller.approve);
router.post("/:id/reject", controller.reject);

module.exports = router;

