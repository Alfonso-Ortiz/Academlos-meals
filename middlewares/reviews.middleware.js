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
