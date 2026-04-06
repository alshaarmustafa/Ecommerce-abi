const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const compression = require('compression')
const { webhookCheckout } = require('./services/orderService');
const app = express();
app.post(
  '/api/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);
app.use(cors())
app.use(compression())
require('dotenv').config();

console.log("ENV TEST:", process.env.STRIPE_WEBHOOK_SECRET);
require('./config/db');
const mountRoutes = require('./mountRoutes');



const AppError = require('./utils/AppError');
const globalErrorHandling = require('./middleware/globalError')


app.use(express.static(path.join(__dirname, 'uploads')));

// Middleware 
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook-checkout') {
    return next();
  }
  express.json()(req, res, next);
});
app.use(express.urlencoded({ extended: true }));
app.set('query parser', 'extended');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}
mountRoutes(app);








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