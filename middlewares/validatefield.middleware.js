const { validationResult } = require('express-validator');

exports.validateField = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'Error',
      errors: errors.mapped(),
    });
  }
  next();
};
