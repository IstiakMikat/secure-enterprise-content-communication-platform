const express = require("express");
const controller = require("../../controllers/admin/userAdminController");

const router = express.Router();

router.get("/", controller.listUsers);
router.patch("/:id/status", controller.updateStatus);
router.patch("/:id/role", controller.updateRole);
router.patch("/:id/department", controller.updateDepartment);

module.exports = router;

