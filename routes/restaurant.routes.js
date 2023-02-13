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
const { validateField } = require('../middlewares/validatefield.middleware');

const router = Router();

router.post(
  '',
  [
    check('name', 'Name es require').not().isEmpty(),
    check('address', 'Address is require').not().isEmpty(),
    check('rating', 'Rating is require').isNumeric(),
  ],
  validateField,
  createRestaurant
);
router.get('', findRestaurants);
router.get('/:id', validateRestaurantExists, findRestaurant);
router.patch('/:id', validateRestaurantExists, updateRestaurant);
router.delete('/:id', validateRestaurantExists, deleteRestaurant);
router.post('/reviews/:id', reviews);
router.patch('/reviews/:restaurantId/:id', updateReviews);
router.delete('/reviews/:restaurantId/:id', deleteReviews);

module.exports = {
  restaurantRouter: router,
};
