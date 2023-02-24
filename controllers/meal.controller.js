const catchAsync = require('../helpers/catchAsync');
const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurant.model');

exports.findMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    attributes: ['name', 'price'],
    where: {
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
    message: 'Meal has been found successfully',
    meal,
  });
});

exports.createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.params;

  const newMeal = await Meal.create({
    restaurantId: id,
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
