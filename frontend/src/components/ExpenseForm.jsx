import React, { useState, useEffect } from 'react'

function ExpenseForm({ onAdd, editingExpense, onUpdate }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title)
      setAmount(editingExpense.amount)
      setCategory(editingExpense.category)
    } else {
      setTitle('')
      setAmount('')
      setCategory('')
    }
  }, [editingExpense])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !amount || !category) return
    if (editingExpense) {
      onUpdate({ title, amount: Number(amount), category })
    } else {
      onAdd({ title, amount: Number(amount), category })
    }
    setTitle('')
    setAmount('')
    setCategory('')
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {editingExpense ? '✏️ Edit Expense' : 'Add Expense'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title (e.g. Groceries)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          placeholder="Amount (e.g. 500)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-500 text-white rounded-lg p-3 font-semibold hover:bg-indigo-600 transition"
        >
          {editingExpense ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm