const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req , res) => {
  try {
    const { expenses } = req.body;

    const expneseSummary = expenses.map((e) => 
    `${e.title}: ${e.amount} (${e.category})`
  ).join('\n');

  const prompt = `
  Here are my recent expenses:
  ${expneseSummary}
  Give me a single , short helpful insight about my spending habits in 2-3 sentences.
  Be specific about the numbers. Be friendly and practical;
  `;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  res.json({insight : text });
  } catch (err) {
    console.log('Full error:', JSON.stringify(err, null, 2))
    console.log('Error message:', err.message)
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;