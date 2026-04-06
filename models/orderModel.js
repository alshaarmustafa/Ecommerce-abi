const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },

    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],

    taxPrice: {
      type: Number,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },

    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },

    totalOrderPrice: Number,

    paymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,
  },
  { timestamps: true },
);
orderSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name email profileImage phone",
  }).populate({ path: "cartItems.product", select: "title imageCover " });
});
module.exports = mongoose.model("Order", orderSchema);
