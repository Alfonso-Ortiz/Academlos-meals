const catchAsync = require('../helpers/catchAsync');
const Restaurant = require('../models/restaurant.model');
const Review = require('../models/reviews.model');

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurant.create({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
    rating,
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Restaurant has been create successfully',
    newRestaurant,
  });
});

exports.findRestaurants = catchAsync(async (req, res, next) => {
  const restaurant = Restaurant.findAll({
    where: {
      status: true,
    },
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Restaurants has been found successfully',
    restaurant,
  });
});

exports.findRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({
    status: 'Success',
    message: 'Restaurant has been found successfully',
    restaurant: {
      name: restaurant.name,
      address: restaurant.address,
      rating: restaurant.rating,
    },
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const { name, address } = req.body;

  const { restaurant } = req;

  await restaurant.update({ name, address });

  return res.status(200).json({
    status: 'Success',
    message: 'Restaurant has been updated successfully  ',
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: false });

  return res.status(200).json({
    status: 'Success',
    message: 'Restaurant deleted successfully',
  });
});

exports.reviews = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;

  const review = await Review.create({
    comment,
    rating,
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Your comment has been posted successfully',
    review,
  });
});

exports.updateReviews = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;

  const { review } = req;

  await review.update({
    comment,
    rating,
  });

  return res.status(200).json({
    status: 'Success',
    message: 'Your comment has been updated successfully',
  });
});

exports.deleteReviews = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: false });

  return res.status(200).json({
    status: 'Success',
    message: 'Your comment has been deleted successfully',
  });
});
