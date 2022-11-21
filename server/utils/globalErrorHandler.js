const CustomError = require('./CustomError');

const handleValidationErr = (err) => {
  const errors = Object.values(err.errors).map((el) => {
    if (el.kind === 'unique') {
      return `This ${el.path} already exists`;
    }
    return el.message;
  });

  return new CustomError('Invalid data', 400, errors);
};

const handleJWTErr = () =>
  new CustomError('Invalid token. Please log in again!', 401);

const handleJWTExpiredErr = () =>
  new CustomError('Your token has expired! Please log in again.', 401);

const sendDevError = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  } else {
    // Log error
    console.error('Error', err);
    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Oops! Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    // Custom error checks
    if (error.name === 'ValidationError') error = handleValidationErr(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTErr();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredErr();

    sendProdError(error, req, res);
  }
};
