const express = require('express');

const { signup, login, getAuth } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/auth', getAuth);

module.exports = router;
