OpsFlow 🚀
A full-stack, role-based e-commerce web application built with React, Spring Boot, and MySQL. OpsFlow provides distinct, secure interfaces for store owners to manage inventory and fulfill orders, and for customers to browse catalogs, manage shopping carts, place orders, and track their purchase history.

📸 Features & Architecture
🛡️ 1. Security & Authentication
Role-Based Access Control: Separate login workflows and secure routing for Store Owners and Customers.

JWT Authentication: Secure token-based session management.

Hardcoded Administrative Access: Dedicated admin credentials (owner / admin123) for store management.

📦 2. Store Owner Portal
Inventory Management: Full CRUD operations for product catalogs with stock quantity tracking.

Local Image Uploads: Direct file uploads (.jpg/.png) processed securely on the backend and served statically.

Order Monitoring & Fulfillment: Real-time visibility into customer purchases with status update controls (e.g., changing orders from PENDING to COMPLETED).

🛒 3. Customer Storefront & Portal
Dynamic Product Catalog: Real-time stock status display and instant product search/filtering.

Interactive Shopping Cart: Client-side cart state management with quantity updates and price calculations.

Checkout & Order History: Persistent order placement stored directly in MySQL, with a dedicated view for customers to track past order statuses.

🛠️ Tech Stack
Frontend: React, React Router, Modern CSS Design System

Backend: Java, Spring Boot, Spring Data JPA, REST APIs

Database: MySQL

Storage: Local file system for product image assets

🚀 Getting Started
Prerequisites
Node.js & npm (for React frontend)

Java JDK 17+ (for Spring Boot backend)

MySQL Server

1. Backend Setup (Spring Boot)
Configure your database connection in src/main/resources/application.properties:

Properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
Run the Spring Boot application (starts on port 4040).

2. Frontend Setup (React)
Navigate to the frontend directory and install dependencies:

Bash
npm install
Start the React development server (typically runs on port 5173):

Bash
npm run dev
👥 Default Credentials
Store Owner: Username: owner | Password: admin123

Customers: Sign up via the registration portal or log in with created customer accounts.
