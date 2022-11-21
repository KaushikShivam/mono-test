const Movie = require('../models/movieModel');
const handleAsync = require('../utils/handleAsync');
const CustomError = require('../utils/CustomError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllMovies = handleAsync(async (req, res, next) => {
  const features = new APIFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const movies = await features.query;

  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: {
      movies,
    },
  });
});

exports.createMovie = handleAsync(async (req, res, next) => {
  const movie = await Movie.create({ ...req.body, creator: req.user._id });

  res.status(201).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.getMovie = handleAsync(async (req, res, next) => {
  const movie = await Movie.findOne({
    _id: req.params.id,
    creator: req.user._id,
  });

  if (!movie) {
    return next(new CustomError('No movie found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.updateMovie = handleAsync(async (req, res, next) => {
  const movie = await Movie.findOneAndUpdate(
    { _id: req.params.id, creator: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!movie) {
    return next(new CustomError('No movie found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.deleteMovie = handleAsync(async (req, res, next) => {
  const movie = await Movie.findOneAndRemove({
    _id: req.params.id,
    creator: req.user._id,
  });

  if (!movie) {
    return next(new CustomError('No movie found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
