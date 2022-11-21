const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie should have a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie should have a description'],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: false,
      trim: true,
    },
    watchUrl: {
      type: String,
      required: [true, 'Movie should have a watch url'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Movie should have a category'],
      trim: true,
    },
    countryOfOrigin: {
      type: String,
      required: [true, 'Movie should have a country of origin'],
      trim: true,
    },
    director: {
      type: String,
      required: [true, 'Movie should have a director'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Movie should have a duration'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Movie rating should be above 1'],
      max: [5, 'Movie rating should be below 1'],
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Movie must belong to a User'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
