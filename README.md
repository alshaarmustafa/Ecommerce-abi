# 🛒 E-Commerce API (Production-Ready Backend)

A scalable and production-ready E-Commerce REST API built with Node.js, Express, and MongoDB.
This project demonstrates a real-world backend system including authentication, cart management, orders, Stripe payments, and secure password recovery.

---

## 🚀 Live API

🔗 https://ecommerce-api-1-8js9.onrender.com/

> ⚠️ Note: The server is hosted on Render (free tier), so it may take a few seconds to respond on the first request.

---

## 📎 Postman Collection

👉 https://raw.githubusercontent.com/alshaarmustafa/Ecommerce-api/main/ecommerce-api.postman_collection.json

---

## 📌 Project Overview

This API provides a full backend solution for an e-commerce platform:

* Authentication & Authorization (JWT)
* Role-based access control (User / Admin / Manager)
* Product & Category management
* Cart & Wishlist system
* Orders (Cash & Online Payment)
* Coupon & discount system
* Stripe integration with webhook automation
* Secure password recovery via email
* Advanced filtering, search, pagination, and sorting

---

## 🧱 Architecture

```bash
controllers/   → Business logic
routes/        → API endpoints
models/        → MongoDB schemas
middleware/    → Auth, validation, error handling
utils/         → Helpers (ApiFeatures, AppError, validators, email)
services/      → Payment & order logic
config/        → Database connection
```

---

## 🛠 Tech Stack

| Layer      | Technology                                                  |
| ---------- | ----------------------------------------------------------- |
| Backend    | Node.js, Express                                            |
| Database   | MongoDB + Mongoose                                          |
| Auth       | JWT                                                         |
| Validation | express-validator (advanced validation layer)               |
| API Utils  | Custom ApiFeatures (filtering, search, pagination, sorting) |
| Security   | helmet, hpp, mongo-sanitize                                 |
| Payments   | Stripe                                                      |
| Email      | Nodemailer                                                  |
| Deployment | Render                                                      |

---

## 🔐 Security Features

* HTTP security headers using helmet
* NoSQL injection protection
* HTTP parameter pollution protection
* Input sanitization
* Secure JWT authentication
* Centralized error handling

---

## ✅ Advanced Validation System

* Input validation for all endpoints
* Database validation (checking related resources existence)
* Business logic validation (e.g. discount < price)
* Relational validation (subcategory belongs to category)
* Safe updates (ensuring at least one field is provided)

---

## 🔎 API Features

### Filtering

GET /api/products?price[gte]=100&price[lte]=500

### Search

GET /api/products?keyword=iphone

### Sorting

GET /api/products?sort=price,-ratingsAverage

### Pagination

GET /api/products?page=2&limit=10

---

## 🛍 Core Features

### Products

* CRUD operations
* Category & subcategory relations
* Brand support

### Cart

* Add, update, remove items
* Clear cart
* Auto price calculation

### Coupons

* Apply discount codes
* Expiration validation

### Orders

* Cash orders
* Stripe online payment
* Stock updates (bulk operations)
* Cart cleanup after order

---

## 💳 Stripe Integration

### Flow:

1. Create checkout session
2. Redirect to Stripe
3. Complete payment
4. Webhook triggers
5. Order is created automatically
6. Stock updated
7. Cart cleared

---

## 🔔 Webhook

Handled event:

checkout.session.completed

---

## 📧 Password Recovery System

* Generate secure reset token
* Token expiration handling
* Send reset email via Nodemailer
* Update password after verification

---

## ⚙️ Installation

```bash
git clone https://github.com/alshaarmustafa/Ecommerce-api.git
cd Ecommerce-api
npm install
```

### Create .env file

```env
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_secret
JWT_EXPIRE_TIME=90d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
EMAIL_FROM=your_email

STRIPE_SECRET=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Run the project

```bash
npm run dev
```

---

## 🌐 Deployment

* Hosted on Render
* MongoDB Atlas database
* Environment variables configured securely

---

## 🧠 Engineering Highlights

* Clean architecture
* Advanced validation layer
* Stripe webhook automation
* Bulk database operations
* Secure password recovery
* Production-ready security practices

---

## 📈 Future Improvements

* Docker support
* Redis caching
* API documentation (Swagger)
* Automated testing

---

## 👨‍💻 Author

Mustafa Alshaar
Backend Developer (Node.js)

GitHub: https://github.com/alshaarmustafa
Email:mustafa555588555@gmail.com

---

## ⭐ Final Note

This project demonstrates strong backend engineering skills and is ready to be used in a professional portfolio.
