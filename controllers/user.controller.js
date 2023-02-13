const catchAsync = require('../helpers/catchAsync');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateJWT = require('../helpers/jwt');
const AppError = require('../helpers/appError');

exports.findUsers = catchAsync(async (req, res) => {
  const users = await User.findAll({
    where: {
      status: true,
    },
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Users has been found successfully',
    users,
  });
});

exports.findUser = catchAsync(async (req, res) => {
  const { user } = req;

  res.status(200).json({
    status: 'Success',
    message: 'User has been found successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role = 'user' } = req.body;

  const user = new User({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: password.toLowerCase(),
    role: role.toLowerCase(),
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const token = await generateJWT(user.id);

  return res.status(200).json({
    status: 'Success',
    message: 'User has been created successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('User could not be found', 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'Success',
    message: 'Login successfully',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
  next();
});

exports.updateUser = catchAsync(async (req, res) => {
  const { name, email } = req.body;

  const { user } = req;

  await user.update({ name, email });

  return res.status(200).json({
    status: 'Success',
    message: 'User has been updated successfully',
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const { user } = req;

  await user.update({ status: false });

  return res.status(200).json({
    status: 'Success',
    message: 'User has been deleted successfully',
  });
});
