const { Router } = require('express');
const { check } = require('express-validator');
const {
  createRestaurant,
  findRestaurants,
  findRestaurant,
  updateRestaurant,
  deleteRestaurant,
  reviews,
  updateReviews,
  deleteReviews,
} = require('../controllers/restaurant.controller');
const {
  validateRestaurantExists,
} = require('../middlewares/restaurant.middleware');
const { validateReviewExists } = require('../middlewares/reviews.middleware');
const {
  protect,
  restricTo,
  protectAccountOwner,
} = require('../middlewares/user.middleware');
const { validateField } = require('../middlewares/validatefield.middleware');

const router = Router();

router.use(protect);

router.post(
  '/',
  [
    check('name', 'Name es require').not().isEmpty(),
    check('address', 'Address is require').not().isEmpty(),
    check('rating', 'Rating is require').isNumeric(),
    validateField,
    restricTo('admin'),
  ],
  createRestaurant
);

router.get('', findRestaurants);

router.get('/:id', validateRestaurantExists, findRestaurant);

router.patch(
  '/:id',
  validateRestaurantExists,
  restricTo('admin'),
  updateRestaurant
);

router.delete(
  '/:id',
  validateRestaurantExists,
  restricTo('admin'),
  deleteRestaurant
);
router.post('/reviews/:id', reviews);
router.patch('/reviews/:restaurantId/:id', validateReviewExists, updateReviews);
router.delete(
  '/reviews/:restaurantId/:id',
  validateReviewExists,
  deleteReviews
);

module.exports = {
  restaurantRouter: router,
};
