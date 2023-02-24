const AppError = require('../helpers/appError');
const bcrypt = require('bcryptjs');
const catchAsync = require('../helpers/catchAsync');
const generateJWT = require('../helpers/jwt');
const User = require('../models/user.model');
const Order = require('../models/order.model');
const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurant.model');

exports.findOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    attributes: { exclude: ['id', 'mealId', 'updatedAt'] },
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
        include: [
          {
            model: Restaurant,
            attributes: ['name', 'address', 'rating'],
          },
        ],
      },
    ],
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Orders has been found successfully',
    orders,
  });
});

exports.findOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Order.findOne({
    attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'status'] },
    where: {
      id,
      userId: sessionUser.id,
      status: 'active',
    },
    include: [
      {
        model: Meal,
        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'status'] },
        where: {
          status: true,
        },
        include: [
          {
            model: Restaurant,
            attributes: ['name', 'address', 'rating'],
          },
        ],
      },
    ],
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Order has been found successfully',
    order,
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
});
