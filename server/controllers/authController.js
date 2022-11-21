const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const handleAsync = require('../utils/handleAsync');
const CustomError = require('../utils/CustomError');

const User = require('../models/userModel');

const sendUserWithToken = (user, statusCode, req, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
};

exports.signup = handleAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  sendUserWithToken(user, 201, req, res);
});

exports.login = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new CustomError('Please provide valid email and password', 400)
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new CustomError('Incorrect email/password', 401));
  }

  sendUserWithToken(user, 200, req, res);
});

exports.authenticate = handleAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new CustomError('Please login to get access', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new CustomError(
        'The user with this token does not exist on server anymore',
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

exports.getAuth = handleAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(200).json({
      status: 'success',
      data: null,
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return res.status(200).json({
      status: 'success',
      data: null,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      token,
      user: freshUser,
    },
  });
});
