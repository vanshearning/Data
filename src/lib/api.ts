import { useState, useEffect, useCallback } from 'react'

function getDeviceId(): string {
  let id = localStorage.getItem('device_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('device_id', id)
  }
  return id
}

export interface UserData {
  id: number
  deviceId: string
  balance: string
  totalDataSoldMb: string
  isSelling: boolean
  sellingStartedAt: string | null
  createdAt: string
}

export interface Transaction {
  id: number
  amountRs: string
  dataMb: string
  createdAt: string
}

export interface Withdrawal {
  id: number
  amountRs: string
  upiId: string
  status: string
  createdAt: string
}

async function apiCall(path: string, options?: RequestInit) {
  const deviceId = getDeviceId()
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': deviceId,
      ...(options?.headers ?? {}),
    },
  })
  return res.json()
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await apiCall('/api/user')
    setUser(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [refresh])

  const toggleSelling = useCallback(async (action: 'start' | 'stop') => {
    const data = await apiCall('/api/user', {
      method: 'POST',
      body: JSON.stringify({ action }),
    })
    setUser(data)
  }, [])

  return { user, loading, refresh, toggleSelling }
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const data = await apiCall('/api/transactions')
  return data.transactions ?? []
}

export async function fetchWithdrawals(): Promise<Withdrawal[]> {
  const data = await apiCall('/api/withdraw')
  return data.withdrawals ?? []
}

export async function submitWithdrawal(amount: number, upiId: string) {
  return apiCall('/api/withdraw', {
    method: 'POST',
    body: JSON.stringify({ amount, upiId }),
  })
}
