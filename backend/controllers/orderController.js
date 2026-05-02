const { Order, OrderItem, ShippingAddress, Product, User, sequelize } = require('../models');

const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const transaction = await sequelize.transaction();

  try {
    const order = await Order.create({
      userId: req.user.id,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'Pending'
    }, { transaction });

    if (shippingAddress) {
      await ShippingAddress.create({
        ...shippingAddress,
        orderId: order.id
      }, { transaction });
    }

    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.product || item.productId || item._id, // handle different frontend structures
        quantity: item.qty || item.quantity,
        price: item.price
      }, { transaction });

      const productIdToFind = item.product || item.productId || item._id;
      if (productIdToFind) {
        const product = await Product.findByPk(productIdToFind, { transaction });
        if (product) {
          product.stock -= (item.qty || item.quantity);
          await product.save({ transaction });
        }
      }
    }

    await transaction.commit();

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'orderItems' },
        { model: ShippingAddress, as: 'shippingAddress' }
      ]
    });

    res.status(201).json({ 
      ...createdOrder.toJSON(), 
      _id: createdOrder.id,
      totalPrice: parseFloat(createdOrder.totalPrice),
      itemsPrice: parseFloat(createdOrder.itemsPrice),
      shippingPrice: parseFloat(createdOrder.shippingPrice),
      taxPrice: parseFloat(createdOrder.taxPrice)
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Creating order failed', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: OrderItem, as: 'orderItems' },
      { model: ShippingAddress, as: 'shippingAddress' }
    ]
  });

  if (order) {
    const json = order.toJSON();
    res.json({ 
      ...json, 
      _id: order.id, 
      user: order.user ? { ...order.user.toJSON(), _id: order.user.id } : null,
      totalPrice: parseFloat(json.totalPrice),
      itemsPrice: parseFloat(json.itemsPrice),
      shippingPrice: parseFloat(json.shippingPrice),
      taxPrice: parseFloat(json.taxPrice)
    });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

const updateOrderToPaid = async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    
    const updatedOrder = await order.save();
    res.json({ ...updatedOrder.toJSON(), _id: updatedOrder.id });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';

    const updatedOrder = await order.save();
    res.json({ ...updatedOrder.toJSON(), _id: updatedOrder.id });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

const getMyOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [
      { model: OrderItem, as: 'orderItems' },
      { model: ShippingAddress, as: 'shippingAddress' }
    ]
  });
  res.json(orders.map(o => {
    const json = o.toJSON();
    return { 
      ...json, 
      _id: o.id,
      totalPrice: parseFloat(json.totalPrice),
      itemsPrice: parseFloat(json.itemsPrice),
      shippingPrice: parseFloat(json.shippingPrice),
      taxPrice: parseFloat(json.taxPrice)
    };
  }));
};

const getOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'name'] },
      { model: OrderItem, as: 'orderItems' },
      { model: ShippingAddress, as: 'shippingAddress' }
    ]
  });
  res.json(orders.map(o => {
    const json = o.toJSON();
    return { 
      ...json, 
      _id: o.id, 
      user: o.user ? { ...o.user.toJSON(), _id: o.user.id } : null,
      totalPrice: parseFloat(json.totalPrice),
      itemsPrice: parseFloat(json.itemsPrice),
      shippingPrice: parseFloat(json.shippingPrice),
      taxPrice: parseFloat(json.taxPrice)
    };
  }));
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders
};