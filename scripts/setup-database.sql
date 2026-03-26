-- EcomDash Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('paid', 'pending', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table (junction table)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_per_unit DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-tenant support: Stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  owner_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add store_id to existing tables for multi-tenancy
ALTER TABLE customers ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id) ON DELETE CASCADE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id) ON DELETE CASCADE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_store_id ON customers(store_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Store policies (store owners can only access their own data)
CREATE POLICY "Store owners can view their own stores" ON stores
  FOR SELECT USING (auth.uid()::text = owner_email);

CREATE POLICY "Store owners can insert their own stores" ON stores
  FOR INSERT WITH CHECK (auth.uid()::text = owner_email);

CREATE POLICY "Store owners can update their own stores" ON stores
  FOR UPDATE USING (auth.uid()::text = owner_email);

CREATE POLICY "Store owners can delete their own stores" ON stores
  FOR DELETE USING (auth.uid()::text = owner_email);

-- Customer policies
CREATE POLICY "Store owners can view their own customers" ON customers
  FOR SELECT USING (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email));

CREATE POLICY "Store owners can insert their own customers" ON customers
  FOR INSERT WITH CHECK (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email));

CREATE POLICY "Store owners can update their own customers" ON customers
  FOR UPDATE USING (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email);

-- Product policies
CREATE POLICY "Store owners can view their own products" ON products
  FOR SELECT USING (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email));

CREATE POLICY "Store owners can insert their own products" ON products
  FOR INSERT WITH CHECK (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email));

CREATE POLICY "Store owners can update their own products" ON products
  FOR UPDATE USING (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email);

-- Order policies
CREATE POLICY "Store owners can view their own orders" ON orders
  FOR SELECT USING (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email));

CREATE POLICY "Store owners can insert their own orders" ON orders
  FOR INSERT WITH CHECK (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email);

CREATE POLICY "Store owners can update their own orders" ON orders
  FOR UPDATE USING (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email);

-- Order items policies
CREATE POLICY "Store owners can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email)
    )
  );

CREATE POLICY "Store owners can insert their own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email)
    )
  );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion (optional)
INSERT INTO stores (name, domain, owner_email) VALUES 
  ('Demo Store', 'demo-store.com', 'demo@example.com')
ON CONFLICT (domain) DO NOTHING;

-- Get the demo store ID for sample data
DO $$
DECLARE
  demo_store_id UUID;
BEGIN
  SELECT id INTO demo_store_id FROM stores WHERE domain = 'demo-store.com';
  
  IF demo_store_id IS NOT NULL THEN
    -- Insert sample customers
    INSERT INTO customers (name, email, store_id) VALUES 
      ('John Doe', 'john@example.com', demo_store_id),
      ('Jane Smith', 'jane@example.com', demo_store_id),
      ('Bob Johnson', 'bob@example.com', demo_store_id)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample products
    INSERT INTO products (name, price, description, category, store_id) VALUES 
      ('Premium T-Shirt', 29.99, 'High quality cotton t-shirt', 'Clothing', demo_store_id),
      ('Classic Jeans', 79.99, 'Comfortable denim jeans', 'Clothing', demo_store_id),
      ('Running Shoes', 129.99, 'Professional running shoes', 'Footwear', demo_store_id),
      ('Leather Wallet', 49.99, 'Genuine leather wallet', 'Accessories', demo_store_id),
      ('Smart Watch', 299.99, 'Fitness tracking smartwatch', 'Electronics', demo_store_id)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample orders
    INSERT INTO orders (customer_id, amount, status, store_id) VALUES 
      ((SELECT id FROM customers WHERE email = 'john@example.com' AND store_id = demo_store_id LIMIT 1), 159.97, 'paid', demo_store_id),
      ((SELECT id FROM customers WHERE email = 'jane@example.com' AND store_id = demo_store_id LIMIT 1), 209.98, 'paid', demo_store_id),
      ((SELECT id FROM customers WHERE email = 'bob@example.com' AND store_id = demo_store_id LIMIT 1), 29.99, 'pending', demo_store_id)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample order items
    INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) 
    SELECT 
      o.id,
      p.id,
      CASE 
        WHEN p.name = 'Premium T-Shirt' THEN 2
        WHEN p.name = 'Classic Jeans' THEN 1
        WHEN p.name = 'Running Shoes' THEN 1
        ELSE 1
      END,
      p.price
    FROM orders o
    CROSS JOIN products p
    WHERE o.store_id = demo_store_id 
    AND p.store_id = demo_store_id
    AND o.status = 'paid'
    AND (p.name = 'Premium T-Shirt' OR p.name = 'Classic Jeans' OR p.name = 'Running Shoes')
    LIMIT 5
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Create view for dashboard analytics
CREATE OR REPLACE VIEW dashboard_analytics AS
SELECT 
  s.id as store_id,
  s.name as store_name,
  COUNT(DISTINCT c.id) as total_customers,
  COUNT(DISTINCT o.id) as total_orders,
  COUNT(DISTINCT p.id) as total_products,
  COALESCE(SUM(CASE WHEN o.status = 'paid' THEN o.amount ELSE 0 END), 0) as total_revenue,
  COALESCE(AVG(CASE WHEN o.status = 'paid' THEN o.amount ELSE NULL END), 0) as avg_order_value,
  COUNT(DISTINCT CASE WHEN o.status = 'paid' THEN o.id END) as paid_orders,
  COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.id END) as pending_orders,
  COUNT(DISTINCT CASE WHEN o.status = 'failed' THEN o.id END) as failed_orders
FROM stores s
LEFT JOIN customers c ON s.id = c.store_id
LEFT JOIN orders o ON s.id = o.store_id
LEFT JOIN products p ON s.id = p.store_id
GROUP BY s.id, s.name;

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON stores TO authenticated;
GRANT ALL ON customers TO authenticated;
GRANT ALL ON products TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;
GRANT SELECT ON dashboard_analytics TO authenticated;
