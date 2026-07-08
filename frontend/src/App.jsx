import React, { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

function App() {
  const [expenses, setExpenses] = useState([])

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

  useEffect(() => {
    fetchExpenses()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Expense Tracker
      </h1>
      <div className="max-w-xl mx-auto">
        <ExpenseForm onAdd={addExpense} />
        <ExpenseList expenses={expenses} onDelete={deleteExpense} />
      </div>
    </div>
  )
}

export default App