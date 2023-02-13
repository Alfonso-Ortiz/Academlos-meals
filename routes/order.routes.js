const { Router } = require('express');
const { check } = require('express-validator');
const {
  findOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/order.controller');
const { validOrderExists } = require('../middlewares/order.middleware');
const { protect, restricTo } = require('../middlewares/user.middleware');
const { validateField } = require('../middlewares/validatefield.middleware');

const router = Router();

router.get('/', findOrders);

router.use(protect);

router.post(
  '/:id',
  [
    check('mealId', 'MealId is require').not().isEmpty(),
    check('quantity', 'Quantity is require').not().isEmpty(),
    validateField,
    restricTo('admin'),
  ],
  validOrderExists,
  createOrder
);

router.patch('/:id', validOrderExists, restricTo('admin'), updateOrder);

router.delete('/:id', validOrderExists, restricTo('admin'), deleteOrder);

module.exports = {
  orderRouter: router,
};
