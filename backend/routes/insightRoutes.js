const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Helper function for rule-based financial analysis fallback
const generateFallbackInsight = (req, expenses) => {
  const expenseEntries = expenses.filter((e) => e.type !== 'income');
  const totalExpense = expenseEntries.reduce((sum, e) => sum + Number(e.amount), 0);

  const categoryTotals = {};
  expenseEntries.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0] ? sortedCategories[0][0] : 'General';
  const topCategoryAmount = sortedCategories[0] ? sortedCategories[0][1] : 0;
  const topCategoryPercent = totalExpense > 0 ? ((topCategoryAmount / totalExpense) * 100).toFixed(0) : 0;

  const budget = req.user.monthlyBudget || 50000;
  const budgetUsagePercent = ((totalExpense / budget) * 100).toFixed(0);

  let advice = `📊 Spending Analysis:\n`;
  advice += `• Top Category: ${topCategory} accounts for ₹${topCategoryAmount.toLocaleString()} (${topCategoryPercent}% of total expenses).\n`;

  if (totalExpense > budget) {
    advice += `• Budget Alert: You have exceeded your ₹${budget.toLocaleString()} monthly budget target by ₹${(totalExpense - budget).toLocaleString()} (${budgetUsagePercent}% used).\n`;
  } else {
    advice += `• Budget Status: You have utilized ${budgetUsagePercent}% of your ₹${budget.toLocaleString()} monthly target (₹${(budget - totalExpense).toLocaleString()} remaining).\n`;
  }

  advice += `• Recommendation: Review high-value ${topCategory} entries to identify potential savings opportunities for next month.`;

  return advice;
};

router.post('/', async (req, res) => {
  try {
    const { expenses } = req.body;

    if (!expenses || expenses.length === 0) {
      return res.json({
        insight: 'No transactions found yet. Add a few expenses to generate personalized financial insights!'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key provided, return fallback insight
    if (!apiKey) {
      return res.json({
        insight: generateFallbackInsight(req, expenses)
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      const expenseSummary = expenses
        .slice(0, 30)
        .map((e) => `- ${e.title}: ₹${e.amount} [${e.category}] (${e.type || 'expense'})`)
        .join('\n');

      const prompt = `
You are an expert AI Financial Advisor for a user named "${req.user.name}".
Monthly Budget Target: ₹${req.user.monthlyBudget || 50000}

Here are the user's recent transactions:
${expenseSummary}

Provide 3 actionable, bulleted insights about their spending patterns, budget status, and saving opportunities. Keep it friendly, direct, concise, and specific with numbers.
`;

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return res.json({ insight: text });
    } catch (apiError) {
      console.warn('Gemini API Warning (falling back to analytical engine):', apiError.message);
      // Fallback seamlessly to rule-based analytical engine on quota/rate-limit errors
      const fallbackText = generateFallbackInsight(req, expenses);
      return res.json({
        insight: fallbackText
      });
    }
  } catch (err) {
    console.error('AI Insight Route Error:', err.message);
    res.status(500).json({ message: 'Error analyzing expenses: ' + err.message });
  }
});

module.exports = router;