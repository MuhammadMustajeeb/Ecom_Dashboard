# EcomDash - Ecommerce Analytics Dashboard

A modern, production-ready SaaS dashboard for ecommerce brands built with Next.js, Tailwind CSS, and Supabase.

## Features

- 📊 **Real-time Analytics Dashboard** - Track revenue, orders, and customer behavior
- 📈 **Interactive Charts** - Revenue trends, order patterns, and top products
- 🛒 **Order Management** - View, filter, and manage all orders
- 👥 **Customer Analytics** - Track customer spending and behavior
- 📦 **Product Performance** - Monitor sales and revenue per product
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Clean, minimal design inspired by Stripe/Vercel

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Database**: Supabase
- **Charts**: Recharts
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

To get these values:
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon public key

### 3. Database Setup

Ensure your Supabase project has the following tables:

#### `orders` table
```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('paid', 'pending', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id UUID REFERENCES customers(id)
);
```

#### `customers` table
```sql
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `products` table
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `order_items` table
```sql
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL
);
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard overview
│   ├── orders/            # Orders management
│   ├── customers/         # Customer analytics
│   ├── products/          # Product performance
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (dashboard)
├── components/            # Reusable UI components
│   ├── ui/               # ShadCN UI components
│   ├── sidebar.tsx       # Navigation sidebar
│   ├── navbar.tsx        # Top navigation
│   ├── layout.tsx        # Main layout wrapper
│   ├── kpi-card.tsx      # KPI metric cards
│   └── theme-provider.tsx # Dark mode context
├── lib/                  # Utilities and configurations
│   ├── supabase.ts       # Supabase client
│   ├── data.ts           # Data fetching functions
│   └── utils.ts          # Utility functions
└── styles/               # Global styles
```

## Key Features Explained

### Dashboard Overview
- **KPI Cards**: Display total revenue, orders, conversion rate, and average order value
- **Revenue Chart**: Line chart showing revenue trends over time
- **Orders Chart**: Track order patterns and volume
- **Top Products**: Bar chart of best-selling products
- **Quick Stats**: Customer and product counts

### Orders Management
- **Order Table**: Complete list of all orders with customer details
- **Status Filtering**: Filter by paid, pending, or failed orders
- **Order Stats**: Summary cards for order metrics
- **Export Functionality**: Download order data

### Customer Analytics
- **Customer Directory**: Complete customer list with spending data
- **Customer Segmentation**: VIP, Premium, and Regular customer badges
- **Top Customers**: Leaderboard of highest-value customers
- **Customer Metrics**: Total customers, revenue, and average spend

### Product Performance
- **Product Catalog**: All products with sales performance
- **Sales Analytics**: Units sold and revenue per product
- **Product Status**: Bestseller, Popular, Active badges
- **Top Products**: Ranking of best-performing products

## UI/UX Features

- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode**: System preference detection with manual toggle
- **Loading States**: Skeleton loaders for better UX
- **Smooth Transitions**: Hover effects and animations
- **Modern Styling**: Clean, minimal interface
- **Accessibility**: Semantic HTML and ARIA labels

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
```bash
npm run build
npm start
```

## License

This project is licensed under the MIT License.

---

Built with ❤️ for ecommerce brands and agencies.
