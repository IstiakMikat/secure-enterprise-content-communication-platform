const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/secure-enterprise-platform",
  sessionTokenTtlHours: Number(process.env.SESSION_TOKEN_TTL_HOURS || 12),
  otpTtlMinutes: Number(process.env.OTP_TTL_MINUTES || 10),
  otpMaxAttempts: Number(process.env.OTP_MAX_ATTEMPTS || 5),
  otpLockMinutes: Number(process.env.OTP_LOCK_MINUTES || 10),
  otpResendCooldownSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 30),
  accountLockThreshold: Number(process.env.ACCOUNT_LOCK_THRESHOLD || 5),
  accountLockMinutes: Number(process.env.ACCOUNT_LOCK_MINUTES || 30),
  resetTokenTtlMinutes: Number(process.env.RESET_TOKEN_TTL_MINUTES || 20),
  sessionSecret: process.env.SESSION_SECRET || "unsafe-session-secret",
  defaultRsaKeySize: Number(process.env.DEFAULT_RSA_KEY_SIZE || 32),
  defaultEccCurve: process.env.DEFAULT_ECC_CURVE || "secp256k1-demo",
  enableBiometricChallenge:
    process.env.ENABLE_BIOMETRIC_CHALLENGE !== "false",
  otpDeliveryMode: process.env.OTP_DELIVERY_MODE || "email",
  otpFallbackToPreview: process.env.OTP_FALLBACK_TO_PREVIEW !== "false",
  smsProvider: process.env.SMS_PROVIDER || "",
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "no-reply@enterprise.local",
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || "",
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl:
    process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
};

module.exports = env;
