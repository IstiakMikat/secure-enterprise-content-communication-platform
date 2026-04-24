const BaseRepository = require("./BaseRepository");
const Post = require("../models/Post");

class PostRepository extends BaseRepository {
  constructor() {
    super(Post);
  }
}

module.exports = new PostRepository();

