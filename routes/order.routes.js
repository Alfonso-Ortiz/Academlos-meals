const { Router } = require('express');
const { check } = require('express-validator');
const {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrders,
} = require('../controllers/order.controller');
const { validOrderExists } = require('../middlewares/order.middleware');
const { protect, restricTo } = require('../middlewares/user.middleware');
const { validateField } = require('../middlewares/validatefield.middleware');

const router = Router();

router.use(protect);

router.get('/me', getOrders);

router.post(
  '/',
  [
    check('mealId', 'MealId is require').not().isEmpty(),
    check('quantity', 'Quantity is require').not().isEmpty(),
    validateField,
  ],
  createOrder
);

router.patch('/:id', validOrderExists, updateOrder);

router.delete('/:id', validOrderExists, deleteOrder);

module.exports = {
  orderRouter: router,
};
