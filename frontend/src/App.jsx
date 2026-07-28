import React, { useState, useEffect, useContext } from 'react'
import { API_BASE_URL } from './config'
import { AuthContext } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseChart from './components/ExpenseChart'
import AIInsight from './components/AIInsight'
import BudgetTracker from './components/BudgetTracker'
import ExportModal from './components/ExportModal'

function App() {
  const { user, token, logout, updateBudget } = useContext(AuthContext)
  const [expenses, setExpenses] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'analytics' | 'ai'
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [editingExpense, setEditingExpense] = useState(null)
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [newBudgetVal, setNewBudgetVal] = useState('')
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [analyticsData, setAnalyticsData] = useState(null)

  const fetchExpenses = async () => {
    if (!token) return
    try {
      let url = `${API_BASE_URL}/api/expenses?`
      if (startDate) url += `startDate=${startDate}&`
      if (endDate) url += `endDate=${endDate}&`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setExpenses(data)
      } else if (response.status === 401) {
        logout()
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err)
    }
  }

  const fetchAnalyticsSummary = async () => {
    if (!token) return
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (err) {
      console.error('Failed to fetch analytics summary:', err)
    }
  }

  const addExpense = async (expense) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(expense)
      })
      if (response.ok) {
        const newExpense = await response.json()
        setExpenses([newExpense, ...expenses])
        fetchAnalyticsSummary()
      }
    } catch (err) {
      console.error('Failed to add expense:', err)
    }
  }

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        setExpenses(expenses.filter((e) => e._id !== id))
        fetchAnalyticsSummary()
      }
    } catch (err) {
      console.error('Failed to delete expense:', err)
    }
  }

  const startEdit = (expense) => {
    setEditingExpense(expense)
  }

  const updateExpense = async (updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses/${editingExpense._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      })
      if (response.ok) {
        const updated = await response.json()
        setExpenses(expenses.map((e) => (e._id === updated._id ? updated : e)))
        setEditingExpense(null)
        fetchAnalyticsSummary()
      }
    } catch (err) {
      console.error('Failed to update expense:', err)
    }
  }

  useEffect(() => {
    fetchExpenses()
    fetchAnalyticsSummary()
  }, [token, startDate, endDate])

  if (!user) {
    return <AuthModal />
  }

  // Client-side search & category filtering
  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory = filter === 'All' || e.category === filter
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Totals
  const totalExpense = expenses
    .filter((e) => e.type !== 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const totalIncome = expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const netBalance = totalIncome - totalExpense

  const handleSaveBudget = (e) => {
    e.preventDefault()
    if (newBudgetVal && !isNaN(newBudgetVal)) {
      updateBudget(newBudgetVal)
      setIsEditingBudget(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navbar Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
              💸
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Smart Expense Tracker</h1>
              <p className="text-slate-400 text-sm">
                Signed in as <span className="text-indigo-400 font-semibold">{user.name}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsExportOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 hover:text-emerald-300 px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            >
              <span>📥 Export CSV</span>
            </button>

            <button
              onClick={logout}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            >
              <span>Logout</span>
              <span>➔</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-lg">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📈</span>
            <span>MongoDB Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🤖</span>
            <span>AI Advisor</span>
          </button>
        </div>

        {/* Budget Target Edit Modal */}
        {isEditingBudget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSaveBudget} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4">
              <h3 className="text-lg font-bold text-white">Update Monthly Budget Target</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Target Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={newBudgetVal}
                  onChange={(e) => setNewBudgetVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingBudget(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Export CSV Modal */}
        <ExportModal
          token={token}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />

        {/* --- TAB 1: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Expenses</p>
                <p className="text-3xl font-extrabold text-indigo-400">₹{totalExpense.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{expenses.filter(e => e.type !== 'income').length} transaction(s)</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Income</p>
                <p className="text-3xl font-extrabold text-emerald-400">₹{totalIncome.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{expenses.filter(e => e.type === 'income').length} source(s)</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Net Savings</p>
                <p className={`text-3xl font-extrabold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ₹{netBalance.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">Income minus Expense</p>
              </div>
            </div>

            {/* Budget Usage */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <BudgetTracker 
                totalAmount={totalExpense} 
                customBudget={user.monthlyBudget}
                onEditBudget={() => { setIsEditingBudget(true); setNewBudgetVal(user.monthlyBudget || 50000); }}
              />
            </div>

            {/* Form and Chart Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <ExpenseForm 
                  onAdd={addExpense} 
                  editingExpense={editingExpense}
                  onUpdate={updateExpense}
                />
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <ExpenseChart expenses={expenses} />
              </div>
            </div>

            {/* Search & Date Filters */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2 flex-wrap items-center">
                {['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Other'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      filter === cat
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs text-slate-500">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                />
                {(startDate || endDate) && (
                  <button
                    onClick={() => { setStartDate(''); setEndDate(''); }}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Clear
                  </button>
                )}
                <input
                  type="text"
                  placeholder="🔍 Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-44"
                />
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <ExpenseList 
                expenses={filteredExpenses} 
                onDelete={deleteExpense}
                onEdit={startEdit} 
              />
            </div>
          </div>
        )}

        {/* --- TAB 2: MONGODB ANALYTICS --- */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">

            {analyticsData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Aggregation Table */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🏷️</span>
                    <span>Category Spending Aggregations</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-400 uppercase bg-slate-950/80">
                        <tr>
                          <th className="p-3 rounded-l-xl">Category</th>
                          <th className="p-3">Total Spent</th>
                          <th className="p-3">Count</th>
                          <th className="p-3">Avg/Txn</th>
                          <th className="p-3 rounded-r-xl">% Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {analyticsData.categoryBreakdown.map((c) => (
                          <tr key={c.category} className="hover:bg-slate-800/40">
                            <td className="p-3 font-semibold text-white">{c.category}</td>
                            <td className="p-3 font-bold text-indigo-400">₹{c.totalAmount.toLocaleString()}</td>
                            <td className="p-3">{c.count}</td>
                            <td className="p-3">₹{c.avgAmount.toLocaleString()}</td>
                            <td className="p-3 font-bold text-emerald-400">{c.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Highlight Card */}
                <div className="space-y-6">
                  {analyticsData.highestExpense && (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-2">
                      <p className="text-slate-400 text-xs font-semibold uppercase">Highest Single Expense</p>
                      <p className="text-2xl font-bold text-rose-400">₹{analyticsData.highestExpense.amount.toLocaleString()}</p>
                      <p className="text-sm font-medium text-white">{analyticsData.highestExpense.title} ({analyticsData.highestExpense.category})</p>
                    </div>
                  )}

                  {/* Monthly Timeline List */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>📅</span>
                      <span>Monthly Spending Timeline</span>
                    </h3>
                    <div className="space-y-3">
                      {analyticsData.monthlyTimeline.map((m) => (
                        <div key={m.label} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                          <span className="font-semibold text-sm text-white">{m.label}</span>
                          <div className="text-right">
                            <span className="text-sm font-bold text-rose-400">₹{m.expense.toLocaleString()}</span>
                            {m.income > 0 && (
                              <span className="text-xs text-emerald-400 ml-3">(+₹{m.income.toLocaleString()})</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: AI ADVISOR --- */}
        {activeTab === 'ai' && (
          <div className="max-w-2xl mx-auto">
            <AIInsight expenses={expenses} token={token} />
          </div>
        )}

      </div>
    </div>
  )
}

export default App