const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderService");

// const {

// } = require('../utils/validators/');

//Autentication & Authorization
const { protect } = require("../middleware/verifyToken");
const allowedTo = require("../utils/authorization/allowedTo");
const userRoles = require("../utils/authorization/userRoles");

router.use(protect);



///checkout-session
router
  .route("/checkout-session/:cartId")
  .get(allowedTo(userRoles.USER), checkoutSession);
router.route("/:cartId").post(allowedTo(userRoles.USER), createOrder);

router
  .route("/")
  .get(
    allowedTo(userRoles.USER, userRoles.ADMIN, userRoles.MANAGER),
    filterOrderForLoggedUser,
    getAllOrders,
  );
  
router
  .route("/:id")
  .get(allowedTo(userRoles.USER), filterOrderForLoggedUser, getOrderById);
router
  .route("/:id/pay")
  .put(allowedTo(userRoles.ADMIN, userRoles.MANAGER), updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(allowedTo(userRoles.ADMIN, userRoles.MANAGER), updateOrderToDelivered);

module.exports = router;
