const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// @route   GET /api/analytics/summary
// @desc    Advanced MongoDB Aggregation Analytics (Monthly trends & Category breakdown)
// @access  Private
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Total Expense & Total Income
    const totals = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    let totalExpense = 0;
    let totalIncome = 0;
    totals.forEach((t) => {
      if (t._id === 'income') totalIncome = t.total;
      if (t._id === 'expense') totalExpense = t.total;
    });

    // 2. Category Breakdown Pipeline (Expenses only)
    const categoryStats = await Expense.aggregate([
      { $match: { userId, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Format category stats with percentage
    const categoryBreakdown = categoryStats.map((item) => ({
      category: item._id,
      totalAmount: item.totalAmount,
      count: item.count,
      avgAmount: Math.round(item.avgAmount),
      percentage: totalExpense > 0 ? Number(((item.totalAmount / totalExpense) * 100).toFixed(1)) : 0
    }));

    // 3. Monthly Spending & Income Trend Pipeline
    const monthlyTrends = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Process monthly trends into structured timeline
    const monthsMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    monthlyTrends.forEach((item) => {
      const key = `${monthNames[item._id.month - 1]} ${item._id.year}`;
      if (!monthsMap[key]) {
        monthsMap[key] = { label: key, expense: 0, income: 0 };
      }
      if (item._id.type === 'income') {
        monthsMap[key].income = item.total;
      } else {
        monthsMap[key].expense = item.total;
      }
    });

    const monthlyTimeline = Object.values(monthsMap);

    // 4. Highest Single Expense
    const highestExpense = await Expense.findOne({ userId, type: 'expense' }).sort({ amount: -1 });

    res.json({
      totalExpense,
      totalIncome,
      netSavings: totalIncome - totalExpense,
      categoryBreakdown,
      monthlyTimeline,
      highestExpense: highestExpense ? { title: highestExpense.title, amount: highestExpense.amount, category: highestExpense.category } : null
    });
  } catch (err) {
    console.error('Analytics Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/analytics/export/csv
// @desc    Export transactions to downloadable CSV
// @access  Private
router.get('/export/csv', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });

    const fields = [
      { label: 'Transaction ID', value: '_id' },
      { label: 'Title', value: 'title' },
      { label: 'Type', value: (row) => row.type || 'expense' },
      { label: 'Category', value: 'category' },
      { label: 'Amount (INR)', value: 'amount' },
      { label: 'Date', value: (row) => new Date(row.date).toISOString().split('T')[0] },
      { label: 'Notes', value: (row) => row.notes || '' }
    ];

    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(expenses);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="Expense-Report-${req.user.name.replace(/\s+/g, '_')}.csv"`);
    res.status(200).send(csvData);
  } catch (err) {
    console.error('CSV Export Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
