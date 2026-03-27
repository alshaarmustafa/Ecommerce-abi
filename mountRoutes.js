const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const reviewRoute = require('./routes/reviewRoute');
const wishlistRoute = require('./routes/wishlistRoute');
const addressRoute = require('./routes/addressRoute');
const couponRoute = require('./routes/couponRoute');
const cartRoute = require('./routes/cartRoute');

const mountRoutes = (app) => {
  app.use('/api/categories', categoryRoute);
  app.use('/api/subCategories', subCategoryRoute);
  app.use('/api/brands', brandRoute);
  app.use('/api/products', productRoute);
  app.use('/api/users', userRoute);
  app.use('/api/auth', authRoute);
  app.use('/api/reviews', reviewRoute);
  app.use('/api/wishlist', wishlistRoute);
  app.use('/api/addresses', addressRoute);
  app.use('/api/coupons', couponRoute);
  app.use('/api/cart', cartRoute);

};

module.exports = mountRoutes;