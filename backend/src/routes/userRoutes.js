const express = require("express");
const controller = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  updateProfileValidator,
  changePasswordValidator,
} = require("../validators/userValidators");

const router = express.Router();

router.use(authMiddleware);
router.get("/profile", controller.getProfile);
router.put("/profile", validateRequest(updateProfileValidator), controller.updateProfile);
router.put(
  "/change-password",
  validateRequest(changePasswordValidator),
  controller.changePassword
);
router.get("/notifications", controller.getNotifications);
router.patch("/notifications/:id/read", controller.markNotificationRead);

module.exports = router;

