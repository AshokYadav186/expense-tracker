import React from 'react'

const categoryColors = {
  Food: 'bg-orange-100 text-orange-600',
  Transport: 'bg-blue-100 text-blue-600',
  Bills: 'bg-red-100 text-red-600',
  Entertainment: 'bg-purple-100 text-purple-600',
  Other: 'bg-gray-100 text-gray-600'
}

function ExpenseList({ expenses, onDelete, onEdit }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-gray-400 text-lg">No expenses yet. Add one above!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Recent Expenses
      </h2>
      <ul className="flex flex-col gap-3">
        {expenses.map((expense) => (
          <li
            key={expense._id}
            className="flex justify-between items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <p className="font-semibold text-gray-700">{expense.title}</p>
                <p className="text-xs text-gray-400">
                  {new Date(expense.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColors[expense.category] || 'bg-gray-100 text-gray-600'}`}>
                {expense.category}
              </span>
              <span className="font-bold text-gray-800">₹{expense.amount}</span>
              <button
                onClick={() => onEdit(expense)}
                className='text-indigo-400 hover:text-indigo-600 transition font-semibold text-sm mr-2'
                >
                  ✏️
                </button>
              <button
                onClick={() => onDelete(expense._id)}
                className="text-red-400 hover:text-red-600 transition font-semibold text-sm"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ExpenseList