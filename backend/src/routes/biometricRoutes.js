const express = require("express");
const controller = require("../controllers/biometricController");
const authMiddleware = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { biometricValidator } = require("../validators/biometricValidators");
const allowRoles = require("../middlewares/rbacMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.post("/enroll", validateRequest(biometricValidator), controller.enroll);
router.post("/verify", validateRequest(biometricValidator), controller.verify);
router.get("/logs", allowRoles("ADMIN"), controller.logs);

module.exports = router;

