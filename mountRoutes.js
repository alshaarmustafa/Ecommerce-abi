const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');

const mountRoutes = (app) => {
  app.use('/api/categories', categoryRoute);
  app.use('/api/subCategories', subCategoryRoute);
  app.use('/api/brands', brandRoute);
  app.use('/api/products', productRoute);
  app.use('/api/users', userRoute);
  app.use('/api/auth', authRoute);
};

module.exports = mountRoutes;