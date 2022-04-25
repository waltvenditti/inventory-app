var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ServiceSchema = new Schema (
  {
    service: {type: String, required: true},
    price: {type: Number, required: true},
    desc: {type: String}
  }
)

// Virtual for service URL
ServiceSchema
  .virtual('url')
  .get(function () {
    return '/index/service/' + this._id; 
  });

// Export model
module.exports = mongoose.model('Service', ServiceSchema);