const catchAsync = require('../helpers/catchAsync');
const Meal = require('../models/meals.model');

exports.findMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: {
      status: true,
    },
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Meals found',
    meals,
  });
});

exports.findMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  return res.status(200).json({
    status: 'Success',
    message: 'Meal found',
    meal,
  });
});

exports.createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;

  const { restaurant } = req;

  const newMeal = await Meal.create({
    name,
    price,
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Meal created successfully',
    newMeal,
  });
});

exports.updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  const { name, price } = req.body;

  const updatedMeal = await meal.update({
    name,
    price,
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Meal updated successfully',
    updatedMeal,
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: false });

  return res.status(200).json({
    status: 'Success',
    message: 'Meal deleted successfully',
  });
});
