const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const approvalRoutes = require("./approvalRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const biometricRoutes = require("./biometricRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/rbacMiddleware");
const userAdminRoutes = require("./admin/userAdminRoutes");
const keyAdminRoutes = require("./admin/keyAdminRoutes");
const logAdminRoutes = require("./admin/logAdminRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/approvals", approvalRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/biometric", biometricRoutes);
router.use("/admin/users", authMiddleware, allowRoles("ADMIN"), userAdminRoutes);
router.use("/admin/keys", authMiddleware, allowRoles("ADMIN"), keyAdminRoutes);
router.use("/admin/logs", authMiddleware, allowRoles("ADMIN"), logAdminRoutes);

module.exports = router;

