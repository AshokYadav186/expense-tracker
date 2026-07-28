import React from 'react'

function BudgetTracker({ totalAmount, customBudget = 50000, onEditBudget }) {
  const budget = customBudget
  const percentage = Math.min((totalAmount / budget) * 100, 100)
  const isExceeded = totalAmount > budget
  const isWarning = totalAmount >= budget * 0.8 && !isExceeded

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🎯</span>
          <span>Monthly Budget Usage</span>
        </h2>
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <div>
            <span className="font-bold text-indigo-400">₹{totalAmount.toLocaleString()}</span> / ₹{budget.toLocaleString()}
          </div>
          {onEditBudget && (
            <button
              onClick={onEditBudget}
              className="text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg font-semibold transition"
            >
              ✏️ Change Target
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-slate-950 rounded-full h-4 overflow-hidden border border-slate-800 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isExceeded ? 'bg-rose-500 shadow-lg shadow-rose-500/50' : isWarning ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>{percentage.toFixed(1)}% of budget utilized</span>
        <span>Remaining: <strong className={budget - totalAmount < 0 ? 'text-rose-400' : 'text-emerald-400'}>₹{(budget - totalAmount).toLocaleString()}</strong></span>
      </div>

      {isExceeded && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
          <span>🚨</span>
          <span>Alert: You have exceeded your monthly budget by ₹{(totalAmount - budget).toLocaleString()}!</span>
        </div>
      )}

      {isWarning && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs font-semibold flex items-center gap-2">
          <span>⚠️</span>
          <span>Warning: You have reached 80% of your monthly budget allocation.</span>
        </div>
      )}
    </div>
  )
}

export default BudgetTracker