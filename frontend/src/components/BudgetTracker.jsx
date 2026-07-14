import React, { useState } from 'react'

function BudgetTracker({ totalAmount }) {
  const [budget, setBudget] = useState('')
  const [savedBudget, setSavedBudget] = useState(null)

  const handleSetBudget = () => {
    if (!budget) return
    setSavedBudget(Number(budget))
  }

  const percentage = savedBudget ? Math.min((totalAmount / savedBudget) * 100, 100) : 0
  const isExceeded = savedBudget && totalAmount > savedBudget
  const isWarning = savedBudget && totalAmount >= savedBudget * 0.8 && !isExceeded

  return (
    <div className={`rounded-2xl shadow p-6 mb-6 ${isExceeded ? 'bg-red-50' : 'bg-white'}`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        💰 Monthly Budget
      </h2>

      {!savedBudget ? (
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Set your monthly budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex-1"
          />
          <button
            onClick={handleSetBudget}
            className="bg-indigo-500 text-white rounded-lg px-6 font-semibold hover:bg-indigo-600 transition"
          >
            Set
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">
              Spent: <span className="font-bold text-gray-700">₹{totalAmount}</span>
            </span>
            <span className="text-gray-500 text-sm">
              Budget: <span className="font-bold text-gray-700">₹{savedBudget}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                isExceeded ? 'bg-red-500' : isWarning ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{percentage.toFixed(0)}% used</span>
            <button
              onClick={() => { setSavedBudget(null); setBudget('') }}
              className="text-sm text-indigo-400 hover:text-indigo-600"
            >
              Reset Budget
            </button>
          </div>

          {isExceeded && (
            <div className="mt-3 p-3 bg-red-100 rounded-lg text-red-600 font-medium text-sm">
              ⚠️ You have exceeded your monthly budget by ₹{totalAmount - savedBudget}!
            </div>
          )}

          {isWarning && (
            <div className="mt-3 p-3 bg-yellow-100 rounded-lg text-yellow-700 font-medium text-sm">
              ⚠️ Warning: You've used 80% of your monthly budget!
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BudgetTracker