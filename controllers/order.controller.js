const catchAsync = require('../helpers/catchAsync');
const Order = require('../models/order.model');
const User = require('../models/user.model');

exports.findOrders = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { user } = req;

  if (user.id !== sessionUser.id) {
    const orders = await Order.findAll({
      where: {
        id,
        status: 'active',
      },
    });

    return res.status(200).json({
      status: 'Success',
      message: 'Orders has been found successfully',
      orders,
    });
  }
});

exports.findOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  return res.status(200).json({
    status: 'Success',
    message: 'Order has been found successfully',
    order,
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { mealId, quantity } = req.body;

  const newOrder = await Order.create({
    mealId,
    quantity,
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Order created successfully',
    newOrder,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  const { status } = req.body;

  const updatedOrder = await order.update({
    status,
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Order updated successfully',
    updatedOrder,
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
