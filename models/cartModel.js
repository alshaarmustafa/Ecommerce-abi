const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                 min: [1, 'quantity must be above or equal 1'],
            },
            color: String,
            price: {
                type: Number,
                 min: [0, 'price  must be above or equal 0'],
            }
        },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: [true, 'Cart must belong to a user']
    }
}, { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);