const CryptoKey = require("../../models/CryptoKey");
const AcademicKeyManager = require("../../crypto/keyManagement/academicKeyManager");
const provider = require("../../crypto/adapters/cryptoProvider");

class KeyAdminService {
  constructor() {
    this.manager = new AcademicKeyManager(provider);
  }

  list() {
    return CryptoKey.find().populate("assignedUserId").sort({ createdAt: -1 });
  }

  generate(payload) {
    return this.manager.generateKeyRecord(payload);
  }

  rotate(keyId, actionBy, reason) {
    return this.manager.rotateKey({ keyId, actionBy, reason });
  }

  revoke(keyId) {
    return this.manager.revokeKey({ keyId });
  }
}

module.exports = new KeyAdminService();

