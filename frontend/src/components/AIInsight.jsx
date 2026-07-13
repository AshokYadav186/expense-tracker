import React, { useState } from "react";

function AIInsight ( { expenses })  {
  const [ insight , setInsight] = useState('')
  const [ loading , setLoading] = useState(false)

  const getInsight = async () => {
  if (expenses.length === 0) return
  setLoading(true)
  try {
    console.log('Sending expenses:', expenses)
    const response = await fetch('http://localhost:5000/api/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expenses })
    })
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Data received:', data)
    setInsight(data.insight)
  } catch (err) {
    console.log('Error:', err.message)
    setInsight('Could not get insight. Please try again.')
  }
  setLoading(false)
}

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        🤖 AI Insight
      </h2>
      <button
      onClick={getInsight}
      disabled= {loading || expenses.length ===0 }
      className="bg-purple-500 text-white rounded-lg p-3 font-semibold hover:bg-purple-600 transition w-full disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Get AI Insight'}
      </button>
      {insight && (
        <p className="mt-4 text-gray-600 leading-relaxed bg-purple-50 p-4 rounded-lg">
          {insight}
        </p>
      )}
    </div>
  )
}

export default AIInsight