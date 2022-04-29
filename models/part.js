var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PartSchema = new Schema (
  {
    name: {type: String, required: true},
    type: {type: String, enum: ["Wheel", "Crankset", "Drivetrain", "Tire"], required: true},
    manf: {type: String},
    specs: [{type: String}],
    sizeInfo: [{type: String}],
    price: {type: Number, required: true},
    invCount: {type: Number},
  }
)

// Virtual for part URL
PartSchema
  .virtual('url')
  .get(function () {
    return '/index/part/' + this._id; 
  });

// Export model
module.exports = mongoose.model('Part', PartSchema);