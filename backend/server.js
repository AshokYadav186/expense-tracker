require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const expenseRoutes = require('./routes/expenseRoutes');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/api/expenses', expenseRoutes);

app.get('/',(req,res) => {
  res.send('Server is runnig!');
});

mongoose.connect(process.env.MONGO_URI)
     .then(() => {
      console.log('MongoDB connected!');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
     })
     .catch((err) => {
      console.log('Connection failed:', err);
     });