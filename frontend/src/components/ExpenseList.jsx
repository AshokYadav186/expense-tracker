import React from 'react'

const categoryBadges = {
  Food: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  Transport: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Bills: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  Entertainment: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  Shopping: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  Salary: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Other: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
}

function ExpenseList({ expenses, onDelete, onEdit }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500">
        <p className="text-4xl mb-2">📭</p>
        <p className="text-sm">No transactions match your search or filter.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>📋</span>
          <span>Recent Transactions ({expenses.length})</span>
        </h2>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => {
          const isIncome = expense.type === 'income'
          return (
            <div
              key={expense._id}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  isIncome ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {isIncome ? '💰' : '💸'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-sm">{expense.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryBadges[expense.category] || categoryBadges.Other}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>
                      {new Date(expense.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    {expense.notes && (
                      <>
                        <span>•</span>
                        <span className="italic text-slate-400">{expense.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`font-extrabold text-base ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isIncome ? '+' : '-'}₹{Number(expense.amount).toLocaleString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition text-xs"
                    title="Edit Transaction"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(expense._id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition text-xs"
                    title="Delete Transaction"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExpenseList