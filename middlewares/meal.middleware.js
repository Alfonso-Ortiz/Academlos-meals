const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const Meal = require('../models/meals.model');

exports.validMealExists = catchAsync(async (req, res, next) => {
  const { id, status } = req.params;

  const meal = await Meal.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!meal) {
    return next(new AppError('Meal was not found', 404));
  }

  req.meal = meal;
  next();
});
