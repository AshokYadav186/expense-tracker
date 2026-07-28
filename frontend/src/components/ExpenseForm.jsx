import React, { useState, useEffect } from 'react'

function ExpenseForm({ onAdd, editingExpense, onUpdate }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('expense')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title)
      setAmount(editingExpense.amount)
      setCategory(editingExpense.category)
      setType(editingExpense.type || 'expense')
      setNotes(editingExpense.notes || '')
    } else {
      setTitle('')
      setAmount('')
      setCategory('')
      setType('expense')
      setNotes('')
    }
  }, [editingExpense])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !amount || !category) return
    const payload = {
      title,
      amount: Number(amount),
      category,
      type,
      notes
    }
    if (editingExpense) {
      onUpdate(payload)
    } else {
      onAdd(payload)
    }
    setTitle('')
    setAmount('')
    setCategory('')
    setType('expense')
    setNotes('')
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
        <span>{editingExpense ? '✏️ Edit Transaction' : '➕ Add New Transaction'}</span>
        {editingExpense && (
          <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold px-2 py-0.5 rounded-md">
            Editing
          </span>
        )}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle: Expense vs Income */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              type === 'expense' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            💸 Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              type === 'income' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            💰 Income
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title</label>
          <input
            type="text"
            placeholder="e.g. Swiggy Groceries, Salary, Rent"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Amount (₹)</label>
            <input
              type="number"
              placeholder="500"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category</label>
            <select
              value={category}
              required
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Notes (Optional)</label>
          <input
            type="text"
            placeholder="Additional details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2"
        >
          <span>{editingExpense ? 'Update Transaction' : 'Save Transaction'}</span>
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm