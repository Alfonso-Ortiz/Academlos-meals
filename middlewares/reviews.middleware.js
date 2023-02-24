const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const Review = require('../models/reviews.model');

exports.validateReviewExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!review) {
    return next(new AppError('Review was not found', 404));
  }

  req.review = review;
  next();
});

exports.validateReviewExists = catchAsync(async (req, res, next) => {
  const { id, restaurantId } = req.params;
  const review = await Review.findOne({
    where: {
      restaurantId,
      id,
    },
  });
  if (!review) {
    return next(new AppError('Review was not found', 404));
  }
  req.review = review;
  console.log(review);
  console.log('entra');
  next();
});
