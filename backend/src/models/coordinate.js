const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Coordinate = mongoose.model('Coordinate', coordinateSchema);

module.exports = Coordinate;
