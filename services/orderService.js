const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const factury = require("./handlerFactury");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

// @desc  create cash order
// @route   POST /api/orders/cartId
// @access  protect/USER
exports.createOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  //1)get cart depend on cartId
  const cart = await Cart.findOne({
    _id: req.params.cartId,
    user: req.user._id,
  });
  if (!cart) {
    return next(
      new AppError(`there is not cart for this id ${req.params.cartId}`, 404),
    );
  }
  if (cart.cartItems.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }
  // check stock is not empty
  for (const item of cart.cartItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    if (product.quantity < item.quantity) {
      return next(
        new AppError(
          `Not enough stock for product ${product.title} ,available ${product.quantity}`,
          400,
        ),
      );
    }
  }
  //2)get order price depend on cart price and check if coupon apply
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //3)create order with default payment method type cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  //4)after creating order decrement product quantity and increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: {
            quantity: -item.quantity,
            sold: item.quantity,
          },
        },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    //5)clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  //6)send response
  res.status(201).json({ status: "success", data: order });
});

// @desc  get all orders
// @route   GET /api/orders
// @access  protect/USER_ADMIN_MANAGER
exports.getAllOrders = factury.getAll(Order);

// @desc  get specific order by id
// @route   GET /api/orders/:id
// @access  protect/USER_ADMIN_MANAGER
exports.getOrderById = factury.getOne(Order);

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});

// @desc  update order to paid
// @route   put /api/orders/:id/pay
// @access  protect/ADMIN_MANAGER
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new AppError(`there is no order for this id ${req.params.id}`, 404),
    );
  }
  if (req.body.status === "yes") {
    order.isPaid = true;
    order.paidAt = Date.now();
  }
  if (req.body.status === "no") {
    order.isPaid = false;
    order.paidAt = undefined;
  }
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc  update order to delivered
// @route   put /api/orders/:id/deliver
// @access  protect/ADMIN_MANAGER
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new AppError(`there is no order for this id ${req.params.id}`, 404),
    );
  }
  if (req.body.status === "yes") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  if (req.body.status === "no") {
    order.isDelivered = false;
    order.deliveredAt = undefined;
  }

  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc  get checkout session from stripe and send it to frontend
// @route   GET /api/orders/checkout-session/:cartId
// @access  protect/USER
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  //1)get cart depend on cartId
  const cart = await Cart.findOne({
    _id: req.params.cartId,
    user: req.user._id,
  });
  if (!cart) {
    return next(
      new AppError(`there is not cart for this id ${req.params.cartId}`, 404),
    );
  }
  if (cart.cartItems.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }
  // check stock is not empty
  for (const item of cart.cartItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    if (product.quantity < item.quantity) {
      return next(
        new AppError(
          `Not enough stock for product ${product.title} ,available ${product.quantity}`,
          400,
        ),
      );
    }
  }
  //2)get order price depend on cart price and check if coupon apply
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //3) create stripe session
  const session = await stripe.checkout.sessions.create({
    line_items: cart.cartItems.map((item) => ({
      price_data: {
        currency: "egp",
        unit_amount: item.price * 100,
        product_data: {
          name: req.user.name,
        },
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  //4) send response
  res.status(200).json({ status: "success", data: session });
});

// createCartOrder(async (session) => {
//   const cartId = session.client_reference_id;
//   const shippingAddress = session.metadata;

// });


exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  console.log("1️⃣ Webhook hit");
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("❌ Signature Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // أضف هذا السطر فوراً
  console.log("🔍 Received Event Type:", event.type); 

  if (event.type === "checkout.session.completed") {
    console.log("✅ SUCCESS: create order Here.....");
  }
  res.status(200).json({ received: true });
});

