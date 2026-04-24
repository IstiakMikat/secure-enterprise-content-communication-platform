class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(payload) {
    return this.model.create(payload);
  }

  findOne(filter, projection = null, options = {}) {
    return this.model.findOne(filter, projection, options);
  }

  findById(id, projection = null, options = {}) {
    return this.model.findById(id, projection, options);
  }

  find(filter = {}, projection = null, options = {}) {
    return this.model.find(filter, projection, options);
  }

  updateOne(filter, update, options = {}) {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
      ...options,
    });
  }

  deleteOne(filter) {
    return this.model.deleteOne(filter);
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

module.exports = BaseRepository;

