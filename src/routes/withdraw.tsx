import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowUpRight, AlertTriangle } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { BottomNav } from '@/components/BottomNav'
import { useUser, submitWithdrawal } from '@/lib/api'

export const Route = createFileRoute('/withdraw')({
  component: WithdrawPage,
})

function WithdrawPage() {
  const { user, loading, refresh } = useUser()
  const [amount, setAmount] = useState('')
  const [upiId, setUpiId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const balance = parseFloat(user?.balance ?? '0').toFixed(2)

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const amt = parseFloat(amount)
    if (!amt || amt <= 0) return setError('Please enter a valid amount')
    if (amt < 50) return setError('Minimum withdrawal is ₹50')
    if (!upiId.trim()) return setError('Please enter your UPI ID')

    setSubmitting(true)
    const res = await submitWithdrawal(amt, upiId.trim())
    setSubmitting(false)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess('Withdrawal request submitted! You will receive payment within 24 hours.')
      setAmount('')
      setUpiId('')
      await refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <main className="flex-1 px-4 py-5 pb-24 space-y-4 max-w-lg mx-auto w-full">
        {/* Notice */}
        <div className="bg-white rounded-2xl border-2 border-green-400 p-4 shadow-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-green-600 mt-0.5 shrink-0" />
            <p className="text-xs font-bold text-gray-800 uppercase leading-relaxed">
              Minimum withdrawal amount is ₹50. Payment will be processed within 24 hours via UPI.
            </p>
          </div>
        </div>

        {/* Withdraw Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <form onSubmit={handleWithdraw} className="space-y-5">
            {/* User Balance */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-green-500 rounded-sm" />
                <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">User Balance</span>
              </div>
              <div className="bg-gray-100 rounded-xl px-4 py-3 text-gray-700 font-semibold">
                {loading ? '...' : `₹ ${balance}`}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight size={16} className="text-green-500" />
                <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">Enter Withdraw Amount</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ENTER AMOUNT IN RUPEES"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 placeholder:text-xs placeholder:tracking-wide focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>

            {/* UPI ID Input */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-sm" />
                <span className="text-xs font-bold tracking-widest text-gray-600 uppercase">Enter UPI ID</span>
              </div>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="example@upi"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              />
            </div>

            {/* Error / Success */}
            {error && (
              <p className="text-red-500 text-xs text-center font-semibold">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-xs text-center font-semibold">{success}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black text-base tracking-widest uppercase rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-70"
            >
              {submitting ? 'Processing...' : 'Withdraw'}
            </button>
          </form>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
