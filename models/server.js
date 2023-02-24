const { db } = require('../database/db');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const AppError = require('../helpers/appError');
const globalErrorHandler = require('../controllers/error.controller');
//rutas
const { mealRouter } = require('../routes/meal.routes');
const { orderRouter } = require('../routes/order.routes');
const { restaurantRouter } = require('../routes/restaurant.routes');
const { userRouter } = require('../routes/users.routes');
const initModel = require('./init.model');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 6000;

    this.paths = {
      meals: '/api/v1/meals',
      orders: '/api/v1/orders',
      restaurants: '/api/v1/restaurants',
      reviews: '/api/v1/reviews',
      users: '/api/v1/users',
    };

    this.middlewares();

    this.routes();

    this.database();
  }

  middlewares() {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    this.app.use(cors());

    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.meals, mealRouter);
    this.app.use(this.paths.orders, orderRouter);
    this.app.use(this.paths.restaurants, restaurantRouter);
    this.app.use(this.paths.users, userRouter);

    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
      );
    });
    this.app.use(globalErrorHandler);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

    initModel();

    db.sync()
      .then(() => console.log('Database synced'))
      .catch(error => console.log(error));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

module.exports = Server;
