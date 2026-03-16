const mongoose = require('mongoose');
const Product = require('./productModel');


const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  ratings: {
    type: Number,
    min: [1, 'Rating must be above or equal 1.0'],
    max: [5, 'Rating must be below or equal 5.0'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product']
  },
}, { timestamps: true }
);

reviewSchema.pre(/^find/, function () {
  this.populate({ path: 'user', select: 'name email ' })
});
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: { _id: '$product', ratingsAverage: { $avg: '$ratings' }, ratingsQuantity: { $sum: 1 } }
    }
  ])
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].ratingsAverage,
      ratingsQuantity: result[0].ratingsQuantity
    })
  }else{
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0
    })
  }
}
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatingsAndQuantity(this.product)
})
reviewSchema.post('deleteOne',{ document: true }, function () {
  this.constructor.calcAverageRatingsAndQuantity(this.product)
})
module.exports = mongoose.model('Review', reviewSchema);
