const { Router } = require('express');
const { check } = require('express-validator');
const {
  findMeals,
  findMeal,
  createMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/meal.controller');
const { validMealExists } = require('../middlewares/meal.middleware');
const { protect, restricTo } = require('../middlewares/user.middleware');
const { validateField } = require('../middlewares/validatefield.middleware');

const router = Router();

router.get('/', findMeals);

router.get('/:id', findMeal);

router.use(protect);

router.post(
  '/:id',
  [
    check('name', 'Name is require').not().isEmpty(),
    check('price', 'Price is require').not().isEmpty(),
    validateField,
  ],
  validMealExists,
  restricTo('admin'),
  createMeal
);

router.patch('/:id', validMealExists, restricTo('admin'), updateMeal);

router.delete('/:id', validMealExists, restricTo('admin'), deleteMeal);

module.exports = {
  mealRouter: router,
};
