CREATE TABLE carts(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES users(id),
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)


DROP TABLE cart_items

CREATE TABLE cart_items (
	cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
	product_id UUID REFERENCES products(id),
	quantity INT NOT NULL CHECK(quantity >=0),
	price_at_add NUMERIC(12,2) NOT NULL,
	PRIMARY KEY(cart_id, product_id)
)

CREATE TABLE orders(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID REFERENCES users(id),
	order_number VARCHAR(50) UNIQUE NOT NULL,
	status order_status DEFAULT 'placed',
 	subtotal NUMERIC(12,2) NOT NULL,
    tax NUMERIC(12,2) DEFAULT 0,
    shipping_fee NUMERIC(12,2) DEFAULT 0,
    discount NUMERIC(12,2) DEFAULT 0,
	platformfee NUMERIC(12,2) DEFAULT 0,
	total NUMERIC(12,2) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE order_items(
	order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
	product_id UUID,
	product_name VARCHAR(150) NOT NULL,
	price numeric(12,2) NOT NULL CHECK(price>=0),
	quantity INT NOT NULL CHECK(quantity > 0),
	PRIMARY KEY(order_id, product_id)
)


CREATE TYPE order_status AS ENUM (
  'placed',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);
