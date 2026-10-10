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
The backend expects a MySQL database. Set these environment variables before starting it; keep credentials out of `application.properties` and source control:

```powershell
$env:AIVEN_MYSQL_HOST = "your-mysql-host"
$env:AIVEN_MYSQL_PORT = "3306"
$env:AIVEN_MYSQL_DATABASE = "opsflow"
$env:AIVEN_MYSQL_USER = "your-db-user"
$env:AIVEN_MYSQL_PASSWORD = "your-db-password"
```

For Aiven, use the connection host, port, database, and user shown in its service connection information. The backend uses Hibernate `ddl-auto=update` to create/update entity tables without dropping existing table data. Start the Spring Boot application (port 4040) after setting the variables.

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
