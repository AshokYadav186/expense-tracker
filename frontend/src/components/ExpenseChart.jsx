import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#f472b6', '#94a3b8']

function ExpenseChart({ expenses }) {
  const expenseDataOnly = expenses.filter((e) => e.type !== 'income')

  const data = expenseDataOnly.reduce((acc, expense) => {
    const existing = acc.find((item) => item.name === expense.category)
    if (existing) {
      existing.value += Number(expense.amount)
    } else {
      acc.push({ name: expense.category, value: Number(expense.amount) })
    }
    return acc
  }, [])

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500">
        <p className="text-3xl mb-2">📊</p>
        <p className="text-sm">No expenses recorded to generate pie chart analytics.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
        <span>📊</span>
        <span>Category Breakdown</span>
      </h2>

      <div className="h-72 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ExpenseChart