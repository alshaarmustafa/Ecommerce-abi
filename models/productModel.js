const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Product title required'],
        minlength: [2, 'Too short product title'],
        maxlength: [200, 'Too long product title'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Product description required'],
        minlength: [20, 'Too short product description'],
        maxlength: [2000, 'Too long product description'],
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity required'],
    }, sold: {
        type: Number,
        default: 0,
    }, price: {
        type: Number,
        required: [true, 'Product price required'],
        max: [200000, 'Too long product price'],
    }, priceAfterDiscount: {
        type: Number,
    },
    colors: [String],
    imageCover: {
        type: String,
        required: [true, 'Product image cover required'],
    },
    images: [String],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category required'],
    },
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
    }],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be below or equal 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });
productSchema.pre(/^find/, function () {
    this.populate({ path: 'category', select: 'name -_id' })
        .populate({ path: 'subcategories', select: 'name -_id' })
});


module.exports = mongoose.model('Product', productSchema);