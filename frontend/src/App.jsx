import React, { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseChart from './components/ExpenseChart'
import AIInsight from './components/AIInsight'
import BudgetTracker from './components/BudgetTracker'

function App() {
  const [expenses, setExpenses] = useState([])
  const [filter, setFilter] = useState('All')
  const [editingExpense, setEditingExpense] = useState(null)
  const filteredExpenses = filter === 'All' 
  ? expenses 
  : expenses.filter((e) => e.category === filter)

  const fetchExpenses = async () => {
    const response = await fetch('http://localhost:5000/api/expenses')
    const data = await response.json()
    setExpenses(data)
  }

  const addExpense = async (expense) => {
    const response = await fetch('http://localhost:5000/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    })
    const newExpense = await response.json()
    setExpenses([...expenses, newExpense])
  }

  const deleteExpense = async (id) => {
    await fetch(`http://localhost:5000/api/expenses/${id}`, {
      method: 'DELETE'
    })
    setExpenses(expenses.filter((e) => e._id !== id))
  }

  const startEdit = (expense) => {
  setEditingExpense(expense)
}

const updateExpense = async (updatedData) => {
  const response = await fetch(`http://localhost:5000/api/expenses/${editingExpense._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })
  const updated = await response.json()
  setExpenses(expenses.map((e) => e._id === updated._id ? updated : e))
  setEditingExpense(null)
}

  const totalAmount = expenses.reduce((sum,e) => sum + e.amount, 0)

  useEffect(() => {
    fetchExpenses()
  }, [])

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-2">
        💸 Expense Tracker
      </h1>
      <p className="text-center text-gray-500 mb-8">Track your spending smartly</p>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500 text-sm mb-1">Total Spent</p>
          <p className="text-3xl font-bold text-indigo-600">₹{totalAmount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500 text-sm mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-indigo-600">{expenses.length}</p>
        </div>
      </div>
      <BudgetTracker totalAmount={totalAmount} />

      {/* Chart and Form Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ExpenseChart expenses={expenses} />
        <div>
          <AIInsight expenses={expenses} />
          <ExpenseForm 
            onAdd={addExpense} 
            editingExpense={editingExpense}
            onUpdate={updateExpense}
          />
        </div>
      </div>
      {/* Filter Bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Other'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-indigo-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expense List */}
      <ExpenseList expenses={filteredExpenses} 
                   onDelete={deleteExpense}
                   onEdit={startEdit} />
    </div>
  </div>
  )
}

export default App