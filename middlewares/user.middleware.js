const AppError = require('../helpers/appError');
const bcrypt = require('bcryptjs');
const catchAsync = require('../helpers/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');

exports.validateUserExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findAll({
    where: {
      id,
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('User was not found', 404));
  }

  req.user = user;
  next();
});

exports.validateEmailExists = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (user && user.status === false) {
    await user.update({ status: true });
    return res.status(200).json({
      status: 'Success',
      message: 'User has been activated',
    });
  }

  if (user) {
    return next(new AppError('User email already exists', 400));
  }

  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { user } = req;

  const { currentPassword, newPassword } = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  const salt = await bcrypt.genSalt(10);
  const encriptedPassword = await bcrypt.hash(newPassword, salt);

  await user.update({
    password: encriptedPassword,
    passwordChangedAt: new Date(),
  });

  res.status(200).json({
    status: 'Success',
    message: 'Password was updated successfully',
  });

  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! please loggin to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    id: decoded.id,
    status: true,
  });

  if (!user) {
    return next(
      new AppError('Owner of this token it not longer available', 401)
    );
  }

  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );

    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError('User recently changed password, please login again', 401)
      );
    }
  }

  req.sessionUser = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account', 401));
  }

  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have permission to perfom this action.!', 403)
      );
    }
  };
};
