const AppError = require('../helpers/appError');

const handleCastError = () => {
  new AppError('Some type of data send does not match was expected', 401);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);

const habdleJWTExpiredError = () =>
  new AppError('Your token has expired, please login again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = () => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERROR 🧨', err);
    res.status(500).json({
      status: 'Fail',
      message: 'Something went wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  err.status = err.status || 'Fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (!error.parent?.code) {
      error = err;
    }

    if (error.parent?.code === '22P02') error = handleCastError(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    sendErrorProd(error, res);

    if (error.name === 'TokenWebTokenError')
      error = habdleJWTExpiredError(error);
  }
};

module.exports = globalErrorHandler;
