const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    uppercase: true,
    required: [true, 'Coupon required'],
    unique: [true, 'Coupon must be unique'],
  },
  expire: {
    type: Date,
    required: [true, 'Coupon expire time required'],
  },
  discount: {
    type: Number,
    required: [true, 'Coupon discount value required'],
    min: [0, 'Discount must be above 0'],
    max: [100, 'Discount must be below 100'],
  }

},
  { timestamps: true }
);



module.exports = mongoose.model('Coupon', couponSchema);
