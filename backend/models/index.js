const { sequelize } = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const { Order, OrderItem, ShippingAddress } = require('./Order');

// User <-> Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product <-> OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Order <-> ShippingAddress
Order.hasOne(ShippingAddress, { foreignKey: 'orderId', as: 'shippingAddress', onDelete: 'CASCADE' });
ShippingAddress.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  ShippingAddress
};
