const catchAsync = require('../helpers/catchAsync');
const Restaurant = require('../models/restaurant.model');
const Review = require('../models/reviews.model');
const User = require('../models/user.model');

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
  const restaurants = await Restaurant.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
    where: {
      status: true,
    },
    include: [
      {
        model: Review,
        attributes: ['comment', 'rating', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
      },
    ],
  });
  return res.status(200).json({
    status: 'Success',
    message: 'Restaurants has been found successfully',
    restaurants,
  });
});

exports.findRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({
    status: 'Success',
    message: 'Restaurant has been found successfully',
    restaurant,
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
  const { sessionUser } = req;
  const { id } = req.params;

  const review = await Review.create({
    userId: sessionUser.id,
    restaurantId: id,
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
