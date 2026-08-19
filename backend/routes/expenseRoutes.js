const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// Protect all expense endpoints
router.use(protect);

// Helper to add _id alias for frontend compatibility
const formatExpense = (expense) => {
  if (!expense) return null;
  return {
    ...expense,
    _id: expense.id
  };
};

// @route   GET /api/expenses
// @desc    Get expenses with filtering, date range & search
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { category, search, startDate, endDate, type } = req.query;

    const where = { userId: req.user.id };

    if (category && category !== 'All') {
      where.category = category;
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    res.json(expenses.map(formatExpense));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/expenses
// @desc    Add a new expense or income
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, type, notes } = req.body;

    if (!title || amount === undefined || !category) {
      return res.status(400).json({ message: 'Title, amount, and category are required' });
    }

    const expense = await prisma.expense.create({
      data: {
        userId: req.user.id,
        title: title.trim(),
        amount: Number(amount),
        category: category.trim(),
        type: type || 'expense',
        date: date ? new Date(date) : new Date(),
        notes: notes ? notes.trim() : ''
      }
    });

    res.status(201).json(formatExpense(expense));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const existingExpense = await prisma.expense.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!existingExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    const { title, amount, category, date, type, notes } = req.body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (amount !== undefined) data.amount = Number(amount);
    if (category !== undefined) data.category = category.trim();
    if (date !== undefined) data.date = new Date(date);
    if (type !== undefined) data.type = type;
    if (notes !== undefined) data.notes = notes.trim();

    const updatedExpense = await prisma.expense.update({
      where: { id: req.params.id },
      data
    });

    res.json(formatExpense(updatedExpense));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const existingExpense = await prisma.expense.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!existingExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    await prisma.expense.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/expenses/stats/summary
// @desc    PostgreSQL Aggregations for category breakdown & totals
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const userId = req.user.id;

    // Aggregation for Category Breakdown (expenses only)
    const categoryGroup = await prisma.expense.groupBy({
      by: ['category'],
      where: { userId, type: 'expense' },
      _sum: { amount: true },
      _count: { _all: true },
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      }
    });

    const categoryStats = categoryGroup.map((item) => ({
      _id: item.category,
      total: item._sum.amount || 0,
      count: item._count._all
    }));

    // Aggregation for Total Income vs Total Expense
    const typeGroup = await prisma.expense.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    typeGroup.forEach((item) => {
      if (item.type === 'income') totalIncome = item._sum.amount || 0;
      if (item.type === 'expense') totalExpense = item._sum.amount || 0;
    });

    res.json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
