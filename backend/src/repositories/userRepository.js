const BaseRepository = require("./BaseRepository");
const User = require("../models/User");

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  findByEmailCipher(ciphertext) {
    return this.model.findOne({ "email.ciphertext": ciphertext });
  }
}

module.exports = new UserRepository();

