const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { db } = require('../database/db');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 6000;

    this.paths = {
      users: '/api/v1/users',
      orders: 'api/v1/orders',
      meals: 'api/v1/meals',
      restaurants: 'api/v1/restaurants',
      reviews: 'api/v1/reviews',
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

  routes() {}

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

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
