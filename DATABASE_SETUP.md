# Database Setup Instructions

## Quick Setup (Recommended)

1. **Go to your Supabase Dashboard**: https://app.supabase.com
2. **Select your project** or create a new one
3. **Open the SQL Editor** from the left sidebar
4. **Copy and paste the entire content** of `scripts/setup-database.sql`
5. **Click "Run"** to execute the script

This will create all tables, indexes, policies, and sample data for you.

## Manual Setup (Advanced)

If you prefer to set up manually, here are the individual steps:

### 1. Create Tables

#### Stores Table (for multi-tenancy)
```sql
CREATE TABLE stores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  owner_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Customers Table
```sql
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Products Table
```sql
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('paid', 'pending', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_per_unit DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Create Indexes

```sql
CREATE INDEX idx_customers_store_id ON customers(store_id);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### 3. Enable Row Level Security (RLS)

```sql
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

### 4. Create Security Policies

```sql
-- Store policies
CREATE POLICY "Store owners can view their own stores" ON stores
  FOR SELECT USING (auth.uid()::text = owner_email);

CREATE POLICY "Store owners can insert their own stores" ON stores
  FOR INSERT WITH CHECK (auth.uid()::text = owner_email);

-- Customer policies
CREATE POLICY "Store owners can view their own customers" ON customers
  FOR SELECT USING (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email));

-- Product policies
CREATE POLICY "Store owners can view their own products" ON products
  FOR SELECT USING (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email));

-- Order policies
CREATE POLICY "Store owners can view their own orders" ON orders
  FOR SELECT USING (store_id IN (SELECT id FROM stores WHERE auth.uid()::text = owner_email));
```

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from:
- Supabase Dashboard → Settings → API
- Copy "Project URL" and "anon public" key

## Authentication Setup

1. **Enable Auth** in Supabase Dashboard
2. **Configure Auth Providers** (Email, GitHub, Google, etc.)
3. **Set up redirect URLs** for your domain

## Testing the Setup

1. Run the development server: `npm run dev`
2. Visit `http://localhost:3000/setup`
3. Create a new store or select existing one
4. Navigate to dashboard to see analytics

## Sample Data

The setup script includes sample data for testing:
- Demo Store with sample products
- Sample customers and orders
- Analytics data to visualize

## Multi-Tenant Architecture

This dashboard supports multiple stores (multi-tenancy):
- Each user can have multiple stores
- Data is isolated by store_id
- Row Level Security ensures users can only access their own data
- Store switcher in navbar for easy navigation

## Troubleshooting

### Common Issues

1. **"localStorage is not defined"** - Fixed by moving localStorage access to useEffect
2. **"No data showing"** - Check that you've selected a store in the store switcher
3. **Permission denied** - Ensure RLS policies are correctly set up
4. **CORS errors** - Add your localhost URL to Supabase CORS settings

### Getting Help

1. Check the browser console for errors
2. Verify Supabase connection in Network tab
3. Ensure all environment variables are set correctly
4. Run the setup script again if needed

## Production Deployment

1. **Set up environment variables** in your hosting platform
2. **Configure CORS** for your production domain
3. **Enable real-time subscriptions** if needed
4. **Set up database backups** in Supabase

## Next Steps

After setup:
1. Customize the dashboard styling
2. Add more analytics features
3. Implement real-time updates
4. Add export functionality
5. Set up monitoring and alerts
