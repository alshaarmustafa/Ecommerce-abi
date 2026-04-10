const path = require("path");
const express = require("express");
const morgan = require("morgan");
const hpp = require("hpp");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');

const cors = require("cors");
const compression = require("compression");
require("dotenv").config();
const { webhookCheckout } = require("./services/orderService");
const mountRoutes = require("./mountRoutes");
const AppError = require("./utils/AppError");
const globalErrorHandling = require("./middleware/globalError");
require("./config/db");

const app = express();

app.post(
  "/api/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

app.use(cors());
app.use(compression());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.set("query parser", "extended");

app.use(
  hpp({
    whitelist: [
      "price", // ضروري جداً لفلترة [gte] و [lte]
      "ratingsAverage", // لفلترة المنتجات حسب التقييم
      "ratingsQuantity",
      "sold", // للفلترة حسب الأكثر مبيعاً
      "quantity", // للفلترة حسب الكمية المتوفرة
      "colors", // للسماح باختيار أكثر من لون في وقت واحد
      "brand", // للسماح باختيار أكثر من ماركة
      "category", // للسماح باختيار أكثر من قسم
      "sort", // أضفها هنا إذا كنت تريد السماح بالترتيب حسب أكثر من معيار
      "fields", // للسماح باختيار حقول متعددة للعرض
      "limit", // أحياناً يتم إرسال معاملات تصفح متكررة
      "page",
    ],
  }),
);
//To apply data sanitization 
app.use(mongoSanitize());
app.use((req, res, next) => {
    const sanitize = (data) => JSON.parse(xss(JSON.stringify(data)));
    
    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);
    
    next();
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Routes
mountRoutes(app);

// Static files
app.use(express.static(path.join(__dirname, "uploads")));

// Global 404
app.use((req, res, next) => {
  return next(
    new AppError(`Can't find this route ${req.originalUrl} on the server`, 404),
  );
});

// Global error handler
app.use(globalErrorHandling);

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down the server due to UnhandledRejection");
    process.exit(1);
  });
});
