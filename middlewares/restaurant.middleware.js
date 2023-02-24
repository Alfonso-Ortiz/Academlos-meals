const catchAsync = require('../helpers/catchAsync');
const Restaurant = require('../models/restaurant.model');
const Review = require('../models/reviews.model');
const User = require('../models/user.model');

exports.validateRestaurantExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
    where: {
      id,
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

  if (!restaurant) {
    return next(new AppError('Restaurant was not found', 404));
  }

  req.restaurant = restaurant;
  next();
});
