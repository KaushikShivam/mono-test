const express = require('express');
const userRouter = require('./userRoutes');
const movieRouter = require('./movieRoutes');

const router = express.Router();

router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = router;
