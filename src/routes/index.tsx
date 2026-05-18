import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Database, Square, Play, TrendingUp } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { BottomNav } from '@/components/BottomNav'
import { useUser, fetchTransactions, type Transaction } from '@/lib/api'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { user, loading, toggleSelling } = useUser()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    fetchTransactions().then(setTransactions)
  }, [user])

  async function handleToggle() {
    if (!user || toggling) return
    setToggling(true)
    await toggleSelling(user.isSelling ? 'stop' : 'start')
    setToggling(false)
  }

  const balance = parseFloat(user?.balance ?? '0').toFixed(2)
  const dataSold = parseFloat(user?.totalDataSoldMb ?? '0').toFixed(0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <main className="flex-1 px-4 py-5 pb-24 space-y-4 max-w-lg mx-auto w-full">
        {/* Notice Banner */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Keep the app open to earn. Your data contribution helps improve internet services.
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-green-500 rounded-sm" />
            <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">Balance</span>
          </div>
          {loading ? (
            <div className="h-9 w-32 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-4xl font-black text-gray-900">₹ {balance}</p>
          )}
        </div>

        {/* Data Sold Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Database size={18} className="text-green-500" />
            <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">Total Data Sold</span>
          </div>
          {loading ? (
            <div className="h-9 w-24 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-4xl font-black text-gray-900">{dataSold} MB</p>
          )}
        </div>

        {/* Selling Toggle Button */}
        <button
          onClick={handleToggle}
          disabled={loading || toggling}
          className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest text-white uppercase flex items-center justify-center gap-3 transition-all shadow-md active:scale-95 disabled:opacity-70 ${
            user?.isSelling
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {user?.isSelling ? (
            <>
              <Square size={20} fill="white" />
              Stop Selling
            </>
          ) : (
            <>
              <Play size={20} fill="white" />
              Start Selling
            </>
          )}
        </button>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-green-500" />
            <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">Recent Transactions</span>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-2">😐</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Data Sold:{' '}
                      <span className="text-green-600">+₹{parseFloat(tx.amountRs).toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-gray-400">{parseFloat(tx.dataMb).toFixed(1)} MB · {new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-semibold">Sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
