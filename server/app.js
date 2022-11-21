const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./utils/globalErrorHandler');

const app = express();

const apiRouter = require('./routes');

// Global middlewares
// 1. body parser
app.use(
  express.json({
    limit: '10kb',
  })
);

// 2. Dev logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3. Rate limit to avoid DDOS
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000, // Per hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// 4. Set security headers
app.use(helmet());

// 5. CORS
app.use(cors());

// 6. Data sanitize against NoSQL
app.use(mongoSanitize());

// 7. Data sanitize against XSS
app.use(xss());

// Mount api router
app.use('/api/v1', apiRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
}

// Unhandled routes
app.all('*', (req, res, next) => {
  next(new CustomError(`This Url does's exist: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
