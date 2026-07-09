# 🛒 CochaYa! - E-commerce & Dashboard API

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

A robust RESTful API built with **Node.js, Express, and PostgreSQL**, designed to power both a public e-commerce platform and a private administrative dashboard. 

This project demonstrates strong backend fundamentals, including secure authentication, relational database modeling, and SQL transaction management for order integrity.

## ✨ Features

* **MVC Architecture:** Clean, modular, and scalable codebase separating routes, controllers, and database configurations.
* **Role-Based Authentication:** Secure user registration and login using `bcryptjs` for password hashing and `jsonwebtoken` (JWT) for session management (Admin/Client roles).
* **Secure Route Middleware:** Protected endpoints that verify token validity and user authorization levels before granting access.
* **SQL Transactions:** Atomic database operations for processing orders and updating inventory simultaneously, preventing data corruption during checkout.

## 📂 Project Structure

```text
cochaya-backend/
├── config/
│   └── db.js                 # PostgreSQL connection pool
├── controllers/
│   ├── auth.controller.js    # Registration and login logic
│   ├── order.controller.js   # Order processing with SQL transactions
│   └── product.controller.js # CRUD operations for the catalog
├── middlewares/
│   └── auth.middleware.js    # JWT verification and Admin role guards
├── routes/
│   ├── auth.routes.js        
│   ├── order.routes.js       
│   └── product.routes.js     
├── index.js                  # Entry point and Express server setup
└── package.json

🚀 Installation & Setup

    Clone the repository:
    Bash

    git clone [https://github.com/your-username/cochaya-api-backend.git](https://github.com/your-username/cochaya-api-backend.git)
    cd cochaya-api-backend

    Install dependencies:
    Bash

    npm install

    Database Configuration:
    Create a PostgreSQL database and execute the SQL scripts to create the required tables (usuarios, productos, pedidos, detalles_pedido).

    Environment Variables:
    Create a .env file in the root directory and add your credentials:
    Fragmento de código

    PORT=3000
    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=cochaya_db
    JWT_SECRET=your_super_secret_key

    Run the development server:
    Bash

    npm run dev

    The server will start on http://localhost:3000.

🌐 API Endpoints Overview
Authentication (/api/auth)

    POST /register - Register a new user (Hashes password).

    POST /login - Authenticate user and receive a JWT.

Products (/api/products)

    GET / - Retrieve all products (Public).

    POST / - Create a new product (Requires Token & Admin Role).

Orders (/api/orders)

    POST / - Submit a new order and deduct stock (Requires Token).

Developed by Daril Dustin - Systems Engineering Portfolio.