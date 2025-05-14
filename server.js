const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');



// ✅ Load environment variables
dotenv.config();

// ✅ Create Express app
const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: 'https://bakers-client.onrender.com', // 🔁 You can change this to '*' for testing
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MongoDB URI is not defined in the .env file');
  process.exit(1);
}
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ✅ Routes
app.get('/', (req, res) => {
  res.send('Bakery Server is running ✅');
});

app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/ledger', require('./routes/ledgerRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
