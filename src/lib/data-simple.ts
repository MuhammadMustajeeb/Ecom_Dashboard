// Simple data fetching without multi-tenancy for demo purposes
// This returns sample data to showcase the dashboard

export async function getDashboardStats() {
  // Return sample data for demo
  return {
    totalRevenue: 45231.89,
    totalOrders: 284,
    conversionRate: 3.2,
    averageOrderValue: 159.97,
    totalCustomers: 156,
    totalProducts: 24
  }
}

export async function getRevenueData() {
  // Generate sample revenue data for last 30 days
  const data = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const baseRevenue = 1000 + Math.random() * 2000
    const weekendBoost = (date.getDay() === 0 || date.getDay() === 6) ? 500 : 0
    const revenue = baseRevenue + weekendBoost + (Math.random() - 0.5) * 300
    
    data.push({
      date: date.toLocaleDateString(),
      revenue: Math.round(revenue * 100) / 100
    })
  }
  
  return data
}

export async function getOrdersData() {
  // Generate sample orders data for last 30 days
  const data = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const baseOrders = 5 + Math.random() * 10
    const weekendBoost = (date.getDay() === 0 || date.getDay() === 6) ? 3 : 0
    const orders = Math.round(baseOrders + weekendBoost + (Math.random() - 0.5) * 5)
    
    data.push({
      date: date.toLocaleDateString(),
      orders: Math.max(1, orders)
    })
  }
  
  return data
}

export async function getTopProducts() {
  // Sample top products data
  return [
    {
      id: '1',
      name: 'Premium T-Shirt',
      sales: 45,
      revenue: 1349.55
    },
    {
      id: '2',
      name: 'Classic Jeans',
      sales: 32,
      revenue: 2559.68
    },
    {
      id: '3',
      name: 'Running Shoes',
      sales: 28,
      revenue: 3639.72
    },
    {
      id: '4',
      name: 'Leather Wallet',
      sales: 51,
      revenue: 2549.49
    },
    {
      id: '5',
      name: 'Smart Watch',
      sales: 15,
      revenue: 4499.85
    }
  ]
}

export async function getOrders() {
  // Sample orders data
  const customers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson']
  const statuses = ['paid', 'pending', 'failed']
  const orders = []
  
  for (let i = 0; i < 50; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    
    orders.push({
      id: `order-${i + 1}`,
      amount: Math.round((20 + Math.random() * 500) * 100) / 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: date.toISOString(),
      customerName: customers[Math.floor(Math.random() * customers.length)],
      customerEmail: `customer${i + 1}@example.com`
    })
  }
  
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getCustomers() {
  // Sample customers data
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Helen']
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Wilson', 'Davis', 'Miller', 'Garcia', 'Martinez', 'Anderson']
  const customers = []
  
  for (let i = 0; i < 25; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const totalOrders = Math.floor(Math.random() * 10) + 1
    const avgOrderValue = 50 + Math.random() * 200
    
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))
    
    customers.push({
      id: `customer-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      date: date.toISOString(),
      totalOrders,
      totalSpend: Math.round(totalOrders * avgOrderValue * 100) / 100
    })
  }
  
  return customers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getProducts() {
  // Sample products data
  const productNames = [
    'Premium T-Shirt', 'Classic Jeans', 'Running Shoes', 'Leather Wallet', 'Smart Watch',
    'Wireless Headphones', 'Backpack', 'Sunglasses', 'Coffee Maker', 'Yoga Mat',
    'Desk Lamp', 'Phone Case', 'Water Bottle', 'Notebook Set', 'Gaming Mouse',
    'Bluetooth Speaker', 'Fitness Tracker', 'Kitchen Knife Set', 'Plant Pot', 'Wall Art'
  ]
  
  const categories = ['Clothing', 'Electronics', 'Accessories', 'Home', 'Sports']
  
  const products = []
  
  for (let i = 0; i < productNames.length; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 180))
    
    const totalSales = Math.floor(Math.random() * 100)
    const price = 15 + Math.random() * 285
    
    products.push({
      id: `product-${i + 1}`,
      name: productNames[i],
      price: Math.round(price * 100) / 100,
      date: date.toISOString(),
      totalSales,
      totalRevenue: Math.round(totalSales * price * 100) / 100
    })
  }
  
  return products.sort((a, b) => b.totalSales - a.totalSales)
}
