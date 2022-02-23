const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');

const app = express();

// eslint-disable-next-line prefer-arrow-callback
app.use(function (req, res, next) {
  const origins = ['http://192.168.88.215:3001', 'http://localhost:3001'];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < origins.length; i++) {
    const origin = origins[i];

    if (req.headers.origin.indexOf(origin) > -1) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
  }

  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,PATCH,POST,DELETE,UPDATE,OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, authorization'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser());

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '100kb',
    type: ['application/json', 'text/plain'],
  })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Routes
app.use('/users', userRouter);

// Error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
