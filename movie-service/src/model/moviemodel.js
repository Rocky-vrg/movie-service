const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  movieName: {
    type: String,
    required: [true, 'movie name must be provided'],
  },
  director: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const model = mongoose.model('Movies', movieSchema);

module.exports = model;
