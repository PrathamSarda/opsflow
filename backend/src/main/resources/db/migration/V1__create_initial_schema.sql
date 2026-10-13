CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DOUBLE PRECISION NOT NULL DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    unit_size VARCHAR(255),
    image_url VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    customer_username VARCHAR(255),
    total_price DOUBLE PRECISION NOT NULL DEFAULT 0,
    status VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE
);
CREATE TABLE IF NOT EXISTS orders_ordered_items (
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    ordered_items VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_orders_customer_username ON orders(customer_username);
