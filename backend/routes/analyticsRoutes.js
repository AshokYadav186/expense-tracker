const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const prisma = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// @route   GET /api/analytics/summary
// @desc    Advanced PostgreSQL Aggregation Analytics (Monthly trends & Category breakdown)
// @access  Private
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Total Expense & Total Income
    const totals = await prisma.expense.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true }
    });

    let totalExpense = 0;
    let totalIncome = 0;
    totals.forEach((t) => {
      if (t.type === 'income') totalIncome = t._sum.amount || 0;
      if (t.type === 'expense') totalExpense = t._sum.amount || 0;
    });

    // 2. Category Breakdown Pipeline (Expenses only)
    const categoryStats = await prisma.expense.groupBy({
      by: ['category'],
      where: { userId, type: 'expense' },
      _sum: { amount: true },
      _count: { _all: true },
      _avg: { amount: true },
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      }
    });

    // Format category stats with percentage
    const categoryBreakdown = categoryStats.map((item) => {
      const sum = item._sum.amount || 0;
      const count = item._count._all || 0;
      const avg = item._avg.amount || 0;
      return {
        category: item.category,
        totalAmount: sum,
        count: count,
        avgAmount: Math.round(avg),
        percentage: totalExpense > 0 ? Number(((sum / totalExpense) * 100).toFixed(1)) : 0
      };
    });

    // 3. Monthly Spending & Income Trend Pipeline using PostgreSQL EXTRACT
    const monthlyTrends = await prisma.$queryRaw`
      SELECT 
        EXTRACT(YEAR FROM "date")::int AS year,
        EXTRACT(MONTH FROM "date")::int AS month,
        "type",
        SUM("amount")::float AS total
      FROM "expenses"
      WHERE "userId" = ${userId}
      GROUP BY year, month, "type"
      ORDER BY year ASC, month ASC
    `;

    // Process monthly trends into structured timeline
    const monthsMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    monthlyTrends.forEach((item) => {
      const monthIndex = Number(item.month) - 1;
      const year = item.year;
      const key = `${monthNames[monthIndex]} ${year}`;
      if (!monthsMap[key]) {
        monthsMap[key] = { label: key, expense: 0, income: 0 };
      }
      if (item.type === 'income') {
        monthsMap[key].income = Number(item.total);
      } else {
        monthsMap[key].expense = Number(item.total);
      }
    });

    const monthlyTimeline = Object.values(monthsMap);

    // 4. Highest Single Expense
    const highestExpense = await prisma.expense.findFirst({
      where: { userId, type: 'expense' },
      orderBy: { amount: 'desc' }
    });

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
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });

    const fields = [
      { label: 'Transaction ID', value: 'id' },
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
