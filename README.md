  # 🧵 Loomly

   **A modern, high-performance, full-stack fashion e-commerce experience.**
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
  [![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)](#)

   [Explore Features](#-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Admin Dashboard](#-admin-dashboard)

---

## 📖 Overview

Loomly is a premium, full-stack e-commerce web application built with the **MERN stack** (MongoDB, Express, React, Node.js). It combines a motion-rich storefront with a protected operations dashboard, taking customers from discovery and saved addresses through Stripe checkout, order tracking, and post-purchase reviews.

---

## ✨ Features

### 🛍️ Storefront and shopping
- **Authentication**: JWT-based sessions with local registration/login and Google sign-in support.
- **Product discovery**: Browse by style and category, search by keyword, sort results, filter by price, and paginate through results.
- **Responsive product pages**: View product galleries, descriptions, features, pricing, stock, size variants, and related actions.
- **Cart and wishlist**: Add products, choose sizes, adjust quantities, remove items, and save favorites for later.
- **Stripe checkout**: Collect shipping details, reuse saved addresses, display an order summary, and pay with Stripe Elements.
- **Orders**: Review order history, open order details, and follow status updates through a visual tracking timeline.
- **Reviews**: Leave product ratings and reviews, then manage or delete your own reviews.
- **Account management**: Update account details, manage multiple addresses and defaults, and change your password.

### 🎨 Experience and performance
- Animated page transitions powered by Framer Motion.
- Lazy-loaded pages with a global loading screen and route-level fallbacks.
- Skeleton states for products, profiles, carts, and other data-heavy views.
- Responsive navigation with a mega menu, profile dropdown, animated marquee, and social links.
- Toast notifications and consistent loading/error feedback for API actions.

### 🛡️ Admin Dashboard

Admins get a protected `/admin` workspace with tabbed tools for:
- **Orders**: View every order and update status to Processing, Shipped, Delivered, or Cancelled.
- **Users**: Review registered users, email addresses, and roles.
- **Categories**: Create categories with names and slugs, and view the current catalog structure.
- **Products**: Create products with descriptions, features, pricing, stock, brands, categories, and multiple uploaded images.

### 🔒 Backend capabilities
- REST API organized around users, products, categories, carts, wishlists, orders, reviews, and payments.
- MongoDB persistence through Mongoose models and reusable API response/error utilities.
- Cloudinary-backed image uploads with Multer handling multipart form data.
- Helmet security headers, CORS configuration, HTTP-only cookie support, request rate limiting, and validation middleware.
- Stripe webhook verification and order finalization after successful payment events.

---

## 💻 Tech Stack

| Frontend 🎨 | Backend ⚙️ | Services & Tools 🛠️ |
| :--- | :--- | :--- |
| **React** (Vite) | **Node.js** | **MongoDB Atlas** (Database) |
| **Tailwind CSS** | **Express.js** | **Cloudinary** (Image Hosting) |
| **Framer Motion** | **Mongoose** | **Stripe API** (Payments) |
| **React Router** | **JWT Authentication** | **Git / GitHub** |
| **Axios** | **Multer** | **Helmet and express-rate-limit** |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have the following installed and set up:
* [Node.js](https://nodejs.org/en/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas connection string)
* [Cloudinary Account](https://cloudinary.com/)
* [Stripe Account](https://stripe.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheManUnderTheHood/Loomly.git
   cd Loomly
   ```

2. **Install and run the frontend**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Install the backend dependencies**
   ```bash
   cd ../Backend
   npm install
   ```

4. **Configure backend environment variables**

   Create `Backend/.env` and configure your secrets:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173
   ACCESS_TOKEN_SECRET=loomly-super-secret-access-token-key
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=loomly-super-secret-refresh-token-key
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
   FRONTEND_URL=http://localhost:5173
   ```

5. **Run the backend server**
   ```bash
   npm run dev
   ```

6. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

   Use `npm run db:destroy` to remove seeded data when needed.

7. **Configure Stripe webhooks**

   Register `https://your-backend-host/api/v1/payment/webhook` in the Stripe Dashboard. Enable `checkout.session.completed` and `checkout.session.async_payment_succeeded`, then add the signing secret as `STRIPE_WEBHOOK_SECRET` in `Backend/.env`. The webhook must receive the raw request body so Stripe signatures can be verified.

## 🧭 Main Routes

| Area | Routes |
| :--- | :--- |
| Public | `/`, `/style/:styleName`, `/product/:productId`, `/search` |
| Authentication | `/login`, `/register` |
| Customer | `/cart`, `/wishlist`, `/checkout`, `/orders`, `/orders/:orderId`, `/profile` |
| Administration | `/admin` |
| Information | `/about`, `/terms`, `/privacy`, `/returns`, `/shipping`, `/disclaimer` |

## 📁 Project Structure

```text
Loomly/
├── Backend/    Express API, MongoDB models, controllers, middleware, and seeders
└── Frontend/   Vite React app, pages, components, contexts, and client API layer
```

The frontend uses Context API providers for authentication, cart, wishlist, and order state. Protected and admin-only routes are enforced at the router boundary as well as by backend authorization middleware.

---

<div align="center">
  <i>Built with ❤️ for the modern web.</i>
</div>
