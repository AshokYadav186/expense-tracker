import React from 'react'
import { PieChart , Pie , Cell , Tooltip , Legend } from 'recharts'

const COLORS  = ['#3b82f6' , '#22c55e' , '#f59e0b', '#ef4444' , '#8b5cf6']

function ExpenseChart( { expenses}){
  const data = expenses.reduce((acc , expense) => {
    const existing = acc.find((item) => item.name === expense.category)
    if(existing){
      existing.value += expense.amount
    }else {
      acc.push({name: expense.category , value : expense.amount})
    }
    return acc
  } , [])

  if ( data.length === 0){
    return null
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <h2 className='text-xl font-semibold mb-4 text-gray-700'>
        Spending by Category
      </h2>
      <div className='flex justify-center'>
        <PieChart width={400} height={320}>
          <Pie
          data = {data}
          cx = {200}
          cy = {130}
          outerRadius={80}
          dataKey="value"
          label = {({percent })=> 
            `${(percent*100).toFixed(0)}%`
          }>
            {data.map((entry,index) => (
              <Cell
              key = {`cell-${index}`}
              fill = {COLORS[index % COLORS.length]}></Cell>
            ))}
          </Pie>
          <Tooltip formatter={(value) => `Rs${value}`}></Tooltip>
          <Legend></Legend>
        </PieChart>
      </div>
    </div>
  )
}

export default ExpenseChart