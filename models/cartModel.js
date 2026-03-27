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
                default: 1
            },
            color: String,
            price: Number
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