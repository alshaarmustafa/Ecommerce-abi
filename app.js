const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
require('dotenv').config();
require('./config/db');

const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute')
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');


const AppError = require('./utils/AppError');
const globalErrorHandling = require('./middleware/globalError')


app.use(express.static(path.join(__dirname, 'uploads')));

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('query parser', 'extended');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}


app.use('/api/categories', categoryRoute);
app.use('/api/subCategories', subCategoryRoute);
app.use('/api/brands', brandRoute);
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);




//Global Middleware for not found routes
app.use((req, res, next) => {
    return next(new AppError(`Can't find this route ${req.originalUrl} on the server`, 404))
});



// Global Error Handling Middleware
app.use(globalErrorHandling);




const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error('Shutting down the server due to UnhandledRejection');
        process.exit(1);
    });
});