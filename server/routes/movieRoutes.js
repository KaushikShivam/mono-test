const express = require('express');
const {
  getAllMovies,
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');

const { authenticate } = require('../controllers/authController');

const router = express.Router();

router.use(authenticate);

router.route('/').get(getAllMovies).post(createMovie);

router.route('/:id').get(getMovie).patch(updateMovie).delete(deleteMovie);

module.exports = router;
