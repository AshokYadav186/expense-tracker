import React from 'react'
 
function ExpenseList({ expenses, onDelete }){
  if( expenses.length == 0){
    return (
      <div className='bg-white rounded-lg shodow-md p-6 text-center text-grey-400'>
        No expenses yet. Add one above!
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold mb-4 text-gray-700'>All Expenses</h2>
      <ul className='flex flex-col gap-3'>
        {expenses.map((expense) => (
          <li
          key={expense._id}
          className='flex jsutify-between items-center border-b pb-3'>
          <div>
            <p className='font-semibold text-gray-700'>{expense.title} </p>
            <p className='text-sm text-gray-400'>{expense.category} </p>
          </div>
          <div className='flex items-center gap-4'>
            <span className='font-bold text-green-600'>Rs{expense.amount}</span>
            <button
            onClick={() => onDelete(expense._id)}
            className='text-red-400 hover:text-red-600 font-semibold transition'>
              Delete
            </button>
          </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ExpenseList