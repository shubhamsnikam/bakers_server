const Sale = require('../models/Sale');
const Product = require('../models/Product');

// Function to get the daily report
exports.getDailyReport = async (req, res) => {
  try {
    // Fetch sales and populate product info
    const sales = await Sale.find().populate('items.product');
    
    if (!sales.length) {
      return res.status(404).json({ message: 'No sales data found' });
    }

    const daily = {};

    sales.forEach(sale => {
      const date = new Date(sale.createdAt).toISOString().split('T')[0]; // Get the date (YYYY-MM-DD)
      const total = sale.items.reduce((sum, item) => {
        if (item.product && item.product.price) {
          return sum + item.product.price * item.quantity;
        }
        return sum;
      }, 0);

      daily[date] = (daily[date] || 0) + total;
    });

    // Transform daily object into an array of { date, total }
    const result = Object.entries(daily).map(([date, total]) => ({
      date,
      total: total.toFixed(2), // Ensure the total is in two decimal places
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching daily report:', err);
    res.status(500).json({ message: 'Error fetching daily report', error: err.message });
  }
};

// Function to get the monthly report
exports.getMonthlyReport = async (req, res) => {
  try {
    // Fetch sales and populate product info
    const sales = await Sale.find().populate('items.product');
    
    if (!sales.length) {
      return res.status(404).json({ message: 'No sales data found' });
    }

    const monthly = {};

    sales.forEach(sale => {
      const month = new Date(sale.createdAt).toISOString().slice(0, 7); // Get the month (YYYY-MM)
      const total = sale.items.reduce((sum, item) => {
        if (item.product && item.product.price) {
          return sum + item.product.price * item.quantity;
        }
        return sum;
      }, 0);

      monthly[month] = (monthly[month] || 0) + total;
    });

    // Transform monthly object into an array of { month, total }
    const result = Object.entries(monthly).map(([month, total]) => ({
      month,
      total: total.toFixed(2), // Ensure the total is in two decimal places
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching monthly report:', err);
    res.status(500).json({ message: 'Error fetching monthly report', error: err.message });
  }
};
