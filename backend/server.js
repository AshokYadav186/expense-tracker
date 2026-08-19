if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const prisma = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const insightRoutes = require('./routes/insightRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://expense-tracker-seven-pi-44.vercel.app', 'http://localhost:5173']
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/insight', insightRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({ message: '💸 Smart Expense Tracker API is running smoothly with PostgreSQL!' });
});

// Database connection & server initialization
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL successfully via Prisma!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ PostgreSQL Connection failed:', err.message);
  });