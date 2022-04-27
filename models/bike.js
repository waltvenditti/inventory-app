var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BikeSchema = new Schema (
  {
    bike: {type: String, required: true},
    year: {type: String},
    manf: {type: String},
    frame: {type: String},
    wheels: {type: String},
    crankset: {type: String},
    drivetrain: {type: String},
    brakes: {type: String},
    tires: {type: String},
    class: {type: String, enum: ['Street', 'Gravel', 'Mountain']},
    price: {type: Number, required: true},
    invCount: {type: Number},
    services: [{type: Schema.Types.ObjectId, ref: 'Service'}]
  }
)

// Virtual for bike URL
BikeSchema
  .virtual('url')
  .get(function () {
    return '/index/bike/' + this._id; 
  });

// Export model
module.exports = mongoose.model('Bike', BikeSchema);