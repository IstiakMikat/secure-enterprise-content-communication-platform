const express = require("express");
const passport = require("../config/passport");
const controller = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerValidator,
  loginValidator,
  otpValidator,
  resendOtpValidator,
} = require("../validators/authValidators");

const router = express.Router();

router.post("/register", validateRequest(registerValidator), controller.register);
router.post("/login", validateRequest(loginValidator), controller.login);
router.post("/verify-otp", validateRequest(otpValidator), controller.verifyOtp);
router.post("/resend-otp", validateRequest(resendOtpValidator), controller.resendOtp);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);
router.post("/logout", authMiddleware, controller.logout);
router.post("/logout-all", authMiddleware, controller.logoutAll);
router.get("/me", authMiddleware, controller.me);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), controller.googleCallback);

module.exports = router;
