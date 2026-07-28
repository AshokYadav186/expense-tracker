import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

function AIInsight({ expenses, token }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/insight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ expenses })
      });
      const data = await response.json();
      setInsight(data.insight);
    } catch (err) {
      console.error('Error fetching AI insight:', err.message);
      setInsight('Could not fetch AI insights. Make sure your server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🤖</span>
          <span>AI Financial Advisor</span>
        </h2>
        <span className="text-xs bg-purple-500/10 border border-purple-500/30 text-purple-400 font-semibold px-2.5 py-1 rounded-full">
          Gemini 2.5
        </span>
      </div>

      <button
        onClick={getInsight}
        disabled={loading || expenses.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Analyzing Spending Habits...</span>
          </>
        ) : (
          <span>Analyze Spending & Get AI Tips</span>
        )}
      </button>

      {insight && (
        <div className="mt-4 p-4 bg-purple-950/40 border border-purple-800/40 rounded-xl text-purple-200 text-sm whitespace-pre-line leading-relaxed shadow-inner">
          {insight}
        </div>
      )}
    </div>
  );
}

export default AIInsight;