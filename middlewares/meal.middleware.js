const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurant.model');

exports.validMealExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    attributes: ['name', 'price', 'restaurantId'],
    where: {
      id,
      status: true,
    },
    include: [
      {
        model: Restaurant,
        attributes: ['name', 'address', 'rating'],
        where: {
          status: true,
        },
      },
    ],
  });

  if (!meal) {
    return next(new AppError('Meal was not found', 404));
  }

  req.meal = meal;
  next();
});
