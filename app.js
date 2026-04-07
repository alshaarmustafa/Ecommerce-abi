const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();
const { webhookCheckout } = require('./services/orderService');
const mountRoutes = require('./mountRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandling = require('./middleware/globalError');
require('./config/db');

const app = express();

// 🔹 webhook route لازم يكون أول شيء قبل أي middleware
app.post(
  '/api/webhook-checkout',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    console.log("🔥 WEBHOOK HIT");
    console.log("STRIPE SECRET:", process.env.STRIPE_WEBHOOK_SECRET);
    return webhookCheckout(req, res, next);
  }
);
app.get('/test', (req, res) => {
  console.log("🔥 TEST HIT");
  res.send("Server is awake");
});

// Middleware بعد الـ webhook
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('query parser', 'extended');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// Routes
mountRoutes(app);

// Static files
app.use(express.static(path.join(__dirname, 'uploads')));

// Global 404
app.use((req, res, next) => {
    return next(new AppError(`Can't find this route ${req.originalUrl} on the server`, 404));
});

// Global error handler
app.use(globalErrorHandling);

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Unhandled Rejection
process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error('Shutting down the server due to UnhandledRejection');
        process.exit(1);
    });
});