const BaseRepository = require("./BaseRepository");
const CryptoKey = require("../models/CryptoKey");

class KeyRepository extends BaseRepository {
  constructor() {
    super(CryptoKey);
  }
}

module.exports = new KeyRepository();

