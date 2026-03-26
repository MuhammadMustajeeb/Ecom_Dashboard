// Realistic dummy data for premium SaaS demo

// Simple date formatting function
function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`
}

// Real customer names (South Asian + International mix)
const customerNames = [
  'Ali Khan', 'Fatima Sheikh', 'Ahmed Raza', 'Sara Ahmed', 'Mohammed Ali',
  'Zainab Malik', 'Omar Hassan', 'Ayesha Siddiqui', 'Bilal Khan', 'Khadija Patel',
  'John Smith', 'Emma Wilson', 'Michael Brown', 'Sophia Johnson', 'William Davis',
  'Olivia Martinez', 'James Anderson', 'Isabella Taylor', 'Robert Thomas', 'Mia Jackson'
]

// Real product names (Pakistani/International e-commerce)
const productNames = [
  'Premium Cotton Kurta', 'Designer Lawn Suit', 'Embroidered Shawl', 'Leather Wallet',
  'Wireless Earbuds', 'Smart Watch Pro', 'Yoga Mat Premium', 'Running Shoes',
  'Denim Jeans Classic', 'Cotton T-Shirt Pack', 'Silk Scarf', 'Perfume Gift Set',
  'Kitchen Knife Set', 'Coffee Maker Deluxe', 'Office Chair Ergonomic', 'Desk Lamp LED',
  'Bluetooth Speaker', 'Phone Case Premium', 'Power Bank 10000mAh', 'Laptop Backpack'
]

// Pakistani cities for realistic data
const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']

// Generate realistic revenue data with weekly patterns
export async function getDashboardStats() {
  return {
    totalRevenue: 2847500, // Rs. 28.47 Lakhs
    totalOrders: 1847,
    conversionRate: 3.8,
    averageOrderValue: 1542,
    totalCustomers: 892,
    totalProducts: 156
  }
}

export async function getRevenueData() {
  const data = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Realistic revenue patterns
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const isFriday = date.getDay() === 5 // Friday shopping in Pakistan
    
    let baseRevenue = 75000 + Math.random() * 45000
    if (isFriday) baseRevenue *= 1.4 // Friday boost
    if (isWeekend) baseRevenue *= 1.2 // Weekend boost
    
    // Add some randomness
    const revenue = baseRevenue + (Math.random() - 0.5) * 20000
    
    data.push({
      date: formatDate(date),
      revenue: Math.round(revenue)
    })
  }
  
  return data
}

export async function getOrdersData() {
  const data = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const isFriday = date.getDay() === 5
    
    let baseOrders = 45 + Math.random() * 25
    if (isFriday) baseOrders *= 1.5
    if (isWeekend) baseOrders *= 1.3
    
    const orders = Math.round(baseOrders + (Math.random() - 0.5) * 15)
    
    data.push({
      date: formatDate(date),
      orders: Math.max(15, orders)
    })
  }
  
  return data
}

export async function getTopProducts() {
  const products = productNames.slice(0, 12)
  const topProducts = products.map((name, index) => {
    const sales = Math.max(8, 85 - index * 6 + Math.random() * 20)
    const price = 1200 + Math.random() * 3800
    
    return {
      id: `product-${index + 1}`,
      name,
      sales: Math.round(sales),
      revenue: Math.round(sales * price)
    }
  })
  
  return topProducts.sort((a, b) => b.sales - a.sales).slice(0, 5)
}

export async function getOrders() {
  const orders = []
  
  for (let i = 0; i < 100; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 60))
    
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)]
    const status = Math.random() < 0.75 ? 'paid' : (Math.random() < 0.5 ? 'pending' : 'failed')
    const amount = 800 + Math.random() * 5000
    
    orders.push({
      id: `ORD-${String(10000 + i).slice(-6)}`,
      amount: Math.round(amount),
      status,
      date: date.toISOString(),
      customerName,
      customerEmail: customerName.toLowerCase().replace(' ', '.') + '@gmail.com',
      city: cities[Math.floor(Math.random() * cities.length)]
    })
  }
  
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getCustomers() {
  const customers = []
  
  for (let i = 0; i < 40; i++) {
    const name = customerNames[i] || `Customer ${i + 1}`
    const totalOrders = Math.floor(Math.random() * 12) + 1
    const avgOrderValue = 1200 + Math.random() * 2000
    
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 180))
    
    customers.push({
      id: `CUST-${String(1000 + i).slice(-4)}`,
      name,
      email: name.toLowerCase().replace(' ', '.') + '@gmail.com',
      date: date.toISOString(),
      totalOrders,
      totalSpend: Math.round(totalOrders * avgOrderValue),
      city: cities[Math.floor(Math.random() * cities.length)],
      isVIP: totalOrders > 8
    })
  }
  
  return customers.sort((a, b) => b.totalSpend - a.totalSpend)
}

export async function getProducts() {
  const products = []
  
  for (let i = 0; i < productNames.length; i++) {
    const name = productNames[i]
    const price = 800 + Math.random() * 4200
    const totalSales = Math.floor(Math.random() * 120) + 5
    
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 365))
    
    products.push({
      id: `PROD-${String(100 + i).slice(-3)}`,
      name,
      price: Math.round(price),
      date: date.toISOString(),
      totalSales,
      totalRevenue: Math.round(totalSales * price),
      category: i < 6 ? 'Clothing' : i < 12 ? 'Electronics' : 'Home & Living',
      status: totalSales > 50 ? 'bestseller' : totalSales > 20 ? 'popular' : 'active'
    })
  }
  
  return products.sort((a, b) => b.totalRevenue - a.totalRevenue)
}

// AI-like insights for dashboard
export async function getInsights() {
  const insights = [
    {
      type: 'positive',
      title: 'Revenue increased 18% this week',
      description: 'Driven by strong sales in Premium Cotton Kurtas and Wireless Earbuds',
      icon: '📈'
    },
    {
      type: 'neutral',
      title: 'Top product: Premium Cotton Kurta',
      description: 'Generated Rs. 142,500 in revenue with 95 units sold',
      icon: '🏆'
    },
    {
      type: 'positive',
      title: 'Customer growth is stable',
      description: '+47 new customers this week, 12% higher than average',
      icon: '👥'
    },
    {
      type: 'warning',
      title: 'Cart abandonment increased slightly',
      description: 'Up 3% from last week, consider checkout optimization',
      icon: '⚠️'
    }
  ]
  
  return insights
}
