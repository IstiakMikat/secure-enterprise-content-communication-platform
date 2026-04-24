const express = require("express");
const controller = require("../../controllers/admin/keyAdminController");
const validateRequest = require("../../middlewares/validateRequest");
const { keyGenerateValidator } = require("../../validators/adminValidators");

const router = express.Router();

router.get("/", controller.listKeys);
router.post("/generate", validateRequest(keyGenerateValidator), controller.generateKey);
router.patch("/:id/rotate", controller.rotateKey);
router.patch("/:id/revoke", controller.revokeKey);

module.exports = router;

