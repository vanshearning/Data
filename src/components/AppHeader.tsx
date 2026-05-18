import { Database, Headphones } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Database size={26} className="text-green-500" />
        <span className="text-lg font-black tracking-widest text-gray-900 uppercase">
          Data Selling
        </span>
      </div>
      <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
        <Headphones size={18} />
      </button>
    </header>
  )
}
