const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb://mikat7b:Mikat007@ac-eblagwy-shard-00-00.0swp6h9.mongodb.net:27017,ac-eblagwy-shard-00-01.0swp6h9.mongodb.net:27017,ac-eblagwy-shard-00-02.0swp6h9.mongodb.net:27017/?ssl=true&replicaSet=atlas-lui4f8-shard-0&authSource=admin&appName=Cluster0",
  sessionTokenTtlHours: Number(process.env.SESSION_TOKEN_TTL_HOURS || 12),
  otpTtlMinutes: Number(process.env.OTP_TTL_MINUTES || 10),
  accountLockThreshold: Number(process.env.ACCOUNT_LOCK_THRESHOLD || 5),
  accountLockMinutes: Number(process.env.ACCOUNT_LOCK_MINUTES || 30),
  resetTokenTtlMinutes: Number(process.env.RESET_TOKEN_TTL_MINUTES || 20),
  academicMacSecret:
    process.env.ACADEMIC_MAC_SECRET || "unsafe-academic-secret",
  defaultRsaKeySize: Number(process.env.DEFAULT_RSA_KEY_SIZE || 32),
  defaultEccCurve: process.env.DEFAULT_ECC_CURVE || "secp256k1-demo",
  enableBiometricChallenge:
    process.env.ENABLE_BIOMETRIC_CHALLENGE !== "false",
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

module.exports = env;
