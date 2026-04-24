const BaseRepository = require("./BaseRepository");
const Session = require("../models/Session");

class SessionRepository extends BaseRepository {
  constructor() {
    super(Session);
  }
}

module.exports = new SessionRepository();

