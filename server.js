const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS for development & production
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://bakers-client.onrender.com'
  ],
  credentials: true
}));


app.use(express.json());

// ✅ Root route (to prevent 404 on base URL)
app.get('/', (req, res) => {
  res.send('Bakery Server is running ✅');
});

// ✅ API Routes
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/ledger', require('./routes/ledgerRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// ✅ Catch-all 404 route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Server & DB Init
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MongoDB URI is not defined in the .env file');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection error:', err));
