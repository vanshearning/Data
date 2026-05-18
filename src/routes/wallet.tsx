import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Database, Clock } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { BottomNav } from '@/components/BottomNav'
import { useUser, fetchWithdrawals, type Withdrawal } from '@/lib/api'

export const Route = createFileRoute('/wallet')({
  component: WalletPage,
})

function WalletPage() {
  const { user, loading } = useUser()
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])

  useEffect(() => {
    fetchWithdrawals().then(setWithdrawals)
  }, [user])

  const balance = parseFloat(user?.balance ?? '0').toFixed(2)
  const dataSold = parseFloat(user?.totalDataSoldMb ?? '0').toFixed(0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <main className="flex-1 px-4 py-5 pb-24 space-y-4 max-w-lg mx-auto w-full">
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

        {/* Withdraw History */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-green-500" />
            <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">Withdraw History</span>
          </div>
          {withdrawals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-5xl mb-3">😔</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide leading-relaxed">
                You haven't withdrawn any amount yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => (
                <div key={w.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">₹{parseFloat(w.amountRs).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{w.upiId} · {new Date(w.createdAt).toLocaleString()}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                      w.status === 'approved'
                        ? 'bg-green-50 text-green-600'
                        : w.status === 'rejected'
                        ? 'bg-red-50 text-red-500'
                        : 'bg-yellow-50 text-yellow-600'
                    }`}
                  >
                    {w.status}
                  </span>
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
