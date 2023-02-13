const { Router } = require('express');
const { check } = require('express-validator');
const { findOrders, findOrder } = require('../controllers/order.controller');
const {
  createUser,
  login,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const { validOrderExists } = require('../middlewares/order.middleware');
const {
  validateEmailExists,
  updatePassword,
  validateUserExists,
  protectAccountOwner,
  protect,
} = require('../middlewares/user.middleware');
const { validateField } = require('../middlewares/validatefield.middleware');

const router = Router();

router.post(
  '/signup',
  [
    check('name', 'Name is require').not().isEmpty(),
    check('email', 'Email is require').not().isEmpty(),
    check('email', 'Email has to be a correct format').isEmail(),
    check('password', 'Password is require').not().isEmpty(),
    check('role', 'Role is require').not().isEmpty(),
    validateField,
    validateEmailExists,
  ],
  createUser
);

router.post(
  '/login',
  [
    check('email', 'Email is require').not().isEmpty(),
    check('email', 'Email has to be a correct format').isEmail(),
    check('password', 'Password is require').not().isEmpty(),
    validateField,
  ],
  login
);

router.use(protect);

router.patch(
  '/:id',
  [
    check('name', 'Name is require').not().isEmpty(),
    check('email', 'Email is require').not().isEmpty(),
    check('email', 'Email has to be a correct format').isEmail(),
    validateField,
    validateUserExists,
    protectAccountOwner,
  ],
  updateUser
);

router.patch(
  '/password/:id',
  [
    check('currentPassword', 'Current password is require').not().isEmpty(),
    check('newPassword', 'New password is require').not().isEmpty(),
    validateField,
    validateUserExists,
    protectAccountOwner,
  ],
  updatePassword
);

router.delete('/:id', validateUserExists, protectAccountOwner, deleteUser);

router.get('/orders', findOrders);

router.get('/order/:id', validOrderExists, findOrder);

module.exports = {
  userRouter: router,
};
