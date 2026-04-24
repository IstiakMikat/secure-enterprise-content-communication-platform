const BiometricProfile = require("../models/BiometricProfile");
const BiometricLog = require("../models/BiometricLog");
const User = require("../models/User");
const cryptoService = require("./cryptoService");
const AppError = require("../utils/AppError");

const buildFaceVector = (base64Image) => {
  const buffer = Buffer.from(String(base64Image || ""), "base64");
  let total = 0;
  for (const byte of buffer.slice(0, 256)) {
    total += byte;
  }
  return `${buffer.length}:${total % 97}:${buffer[0] || 0}:${buffer[1] || 0}`;
};

class BiometricService {
  async enroll(userId, payload, context) {
    const vector = buildFaceVector(payload.image);
    const templateVector = await cryptoService.encryptField(
      vector,
      "RSA",
      "BIOMETRIC_TEMPLATE"
    );

    const profile = await BiometricProfile.findOneAndUpdate(
      { userId },
      { templateVector, provider: "ACADEMIC_FACEPRINT", isEnabled: true },
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(userId, { biometricEnabled: true });

    await BiometricLog.create({
      userId,
      action: "ENROLL",
      result: "SUCCESS",
      confidenceScore: 1,
      device: context.device,
      ipAddress: context.ipAddress,
    });

    return profile;
  }

  async verify(userId, payload, context) {
    const profile = await BiometricProfile.findOne({ userId, isEnabled: true });
    if (!profile) {
      throw new AppError("Biometric profile not enrolled", 404);
    }

    const storedVector = await cryptoService.decryptField(
      profile.templateVector,
      "BIOMETRIC_TEMPLATE"
    );
    const incomingVector = buildFaceVector(payload.image);
    const confidenceScore =
      storedVector === incomingVector ? 0.99 : storedVector.split(":")[0] === incomingVector.split(":")[0] ? 0.72 : 0.31;

    const result = confidenceScore >= 0.7 ? "SUCCESS" : "FAILED";

    await BiometricLog.create({
      userId,
      action: "VERIFY",
      result,
      confidenceScore,
      device: context.device,
      ipAddress: context.ipAddress,
    });

    return {
      verified: result === "SUCCESS",
      confidenceScore,
    };
  }

  logs() {
    return BiometricLog.find().populate("userId").sort({ createdAt: -1 });
  }
}

module.exports = new BiometricService();

