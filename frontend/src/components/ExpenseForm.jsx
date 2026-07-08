import React, { useState } from 'react'

function ExpenseForm( { onAdd }) {
  const [ title, setTitle] = useState('')
  const [ amount , setAmount] = useState('')
  const [ category, setCategory] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !amount || !category) return 
    onAdd({ title, amount: Number(amount), category })
    setTitle('')
    setAmount('')
    setCategory('')
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <h2 className='text-xl font-semibold mb-4 text-grey-700'> Add Expense</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" 
        placeholder='Title (e.g. Groceries)'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='border rounded-lg p-3 text-grey-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <input 
          type="number"
          placeholder='Amount (e.g. 500)'
          value = {amount}
          onChange={(e) => setAmount(e.target.value)} 
          className='border rounded-lg p-3 text-grey-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
        />

        <select 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className='border rounded-lg p-3 text-grey-700 focus:outline-none focus:ring-2 focus-ring-blue-400' 
        >
          <option value=""> Select Category</option>
          <option value="Food"> Food</option>
          <option value="Transport"> Transport</option>
          <option value="Bills">Bills </option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other"> Other</option>
        </select>
        <button 
        type='submit'
        className='bg-blue-500 text-white rounded-lg p-3 font-semibold hover:bg-blue-600 transition'>
          Add Expense
        </button>
      </form>
    </div>

  )
}

export default ExpenseForm