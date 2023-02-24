const Meal = require('./meals.model');
const Order = require('./order.model');
const Restaurant = require('./restaurant.model');
const Review = require('./reviews.model');
const User = require('./user.model');

const initModel = () => {
  // 1 usuario <------------> N orders
  User.hasMany(Order, { sourceKey: 'id', foreignKey: 'userId' });
  Order.belongsTo(User, { sourceKey: 'id', foreignKey: 'userId' });

  // 1 orders <------------> 1 meals
  Meal.hasOne(Order, { sourceKey: 'id', foreignKey: 'mealId' });
  Order.belongsTo(Meal, { sourceKey: 'id', foreignKey: 'mealId' });

  // 1 restaurant <------------> N meals
  Restaurant.hasMany(Meal, { sourceKey: 'id', foreignKey: 'restaurantId' });
  Meal.belongsTo(Restaurant, { sourceKey: 'id', foreignKey: 'restaurantId' });

  // 1 restaurant <------------> N reviews
  Restaurant.hasMany(Review, { sourceKey: 'id', foreignKey: 'restaurantId' });
  Review.belongsTo(Restaurant, { sourceKey: 'id', foreignKey: 'restaurantId' });

  // N reviews <------------> 1 user
  User.hasMany(Review, { sourceKey: 'id', foreignKey: 'userId' });
  Review.belongsTo(User, { sourceKey: 'id', foreignKey: 'userId' });
};

module.exports = initModel;
