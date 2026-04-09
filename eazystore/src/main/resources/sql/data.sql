INSERT INTO products (name, description, price, popularity, image_url, brand, category, packaging, available_quantity, created_at, created_by, updated_at, updated_by)
VALUES ('Margherita Pizza', 'Classic cheese and tomato', 9.99, 90, '', 'Pizza Hut', 'Pizza', 'Box', 50, CURRENT_TIMESTAMP, 'admin', NULL, NULL);

INSERT INTO products (name, description, price, popularity, image_url, brand, category, packaging, available_quantity, created_at, created_by, updated_at, updated_by)
VALUES ('Pepperoni Pizza', 'Spicy pepperoni with mozzarella', 12.99, 95, '', 'Domino''s', 'Pizza', 'Box', 100, CURRENT_TIMESTAMP, 'admin', NULL, NULL);

INSERT INTO products (name, description, price, popularity, image_url, brand, category, packaging, available_quantity, created_at, created_by, updated_at, updated_by)
VALUES ('Veggie Supreme', 'Loaded with fresh veggies', 11.99, 80, '', 'Papa John''s', 'Pizza', 'Box', 30, CURRENT_TIMESTAMP, 'admin', NULL, NULL);

INSERT INTO products (name, description, price, popularity, image_url, brand, category, packaging, available_quantity, created_at, created_by, updated_at, updated_by)
VALUES ('Coca-Cola', 'Chilled 500ml bottle', 1.99, 98, '', 'Coca-Cola', 'Cold Drinks', 'Bottle', 200, CURRENT_TIMESTAMP, 'admin', NULL, NULL);

INSERT INTO products (name, description, price, popularity, image_url, brand, category, packaging, available_quantity, created_at, created_by, updated_at, updated_by)
VALUES ('Pepsi', 'Chilled 500ml can', 1.49, 85, '', 'Pepsi', 'Cold Drinks', 'Can', 150, CURRENT_TIMESTAMP, 'admin', NULL, NULL);

INSERT INTO products (name, description, price, popularity, image_url, brand, category, packaging, available_quantity, created_at, created_by, updated_at, updated_by)
VALUES ('Garlic Bread', 'Freshly baked with garlic butter', 3.49, 88, '', 'Domino''s', 'Breads', 'Foil Wrapper', 60, CURRENT_TIMESTAMP, 'admin', NULL, NULL);

INSERT INTO products (name, description, price, popularity, image_url, brand, category, packaging, available_quantity, created_at, created_by, updated_at, updated_by)
VALUES ('Cheese Stuffed Bread', 'Gooey cheese inside', 4.99, 92, '', 'Pizza Hut', 'Breads', 'Box', 40, CURRENT_TIMESTAMP, 'admin', NULL, NULL);

INSERT INTO coupons (code, discount_percentage, is_active, created_at, created_by) VALUES ('PIZZA10', 10.0, true, CURRENT_TIMESTAMP, 'admin');
INSERT INTO coupons (code, discount_percentage, is_active, created_at, created_by) VALUES ('WELCOME20', 20.0, true, CURRENT_TIMESTAMP, 'admin');
INSERT INTO coupons (code, discount_percentage, is_active, created_at, created_by) VALUES ('FREESHIP', 15.0, true, CURRENT_TIMESTAMP, 'admin');