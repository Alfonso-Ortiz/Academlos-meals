const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const Meal = require('../models/meals.model');
const Order = require('../models/order.model');
const Restaurant = require('../models/restaurant.model');

exports.getOrders = catchAsync(async (req, res, next) => {
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

exports.createOrder = catchAsync(async (req, res, next) => {
  const { mealId, quantity } = req.body;
  const { sessionUser } = req;

  const meal = await Meal.findOne({
    where: {
      id: mealId,
      status: true,
    },
  });

  if (!meal) {
    return next(new AppError('Meal was not found', 404));
  }

  const price = meal.price * quantity;

  const order = await Order.create({
    mealId,
    userId: sessionUser.id,
    totalPrice: price,
    quantity,
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Order created successfully',
    order,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  console.log(order);
  await order.update({ status: 'completed' });

  return res.status(200).json({
    status: 'Success',
    message: 'Order updated successfully',
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'cancelled' });

  return res.status(200).json({
    status: 'Success',
    message: 'Order cancelled successfully',
  });
});
