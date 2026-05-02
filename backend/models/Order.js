const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('UPI', 'Card', 'COD'),
    allowNull: false
  },
  itemsPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  taxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paidAt: {
    type: DataTypes.DATE
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deliveredAt: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered'),
    defaultValue: 'Pending'
  }
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

const ShippingAddress = sequelize.define('ShippingAddress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullName: { type: DataTypes.STRING, allowNull: false },
  street: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  postalCode: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false }
});

module.exports = { Order, OrderItem, ShippingAddress };