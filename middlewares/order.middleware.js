const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const Order = require('../models/order.model');

exports.validOrderExists = catchAsync(async (req, res, next) => {
  const { id, status } = req.params;

  const order = await Order.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!order) {
    return next(new AppError('Order was not found', 404));
  }

  if (status === 'completed') {
    return next(new AppError('Order has been complete', 404));
  }

  req.order = order;
  next();
});
