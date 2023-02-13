const catchAsync = require('../helpers/catchAsync');
const Restaurant = require('../models/restaurant.model');

exports.validateRestaurantExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findAll({
    where: {
      id,
      status: true,
    },
  });

  if (!restaurant) {
    return next(new AppError('Restaurant was not found', 404));
  }

  req.restaurant = restaurant;
  next();
});
