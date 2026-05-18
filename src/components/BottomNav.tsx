import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Wallet, ArrowUpRight } from 'lucide-react'

export function BottomNav() {
  const { location } = useRouterState()
  const path = location.pathname

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
      <NavItem href="/" label="HOME" icon={<Home size={22} />} active={path === '/'} />
      <NavItem href="/wallet" label="WALLET" icon={<Wallet size={22} />} active={path === '/wallet'} />
      <NavItem href="/withdraw" label="WITHDRAW" icon={<ArrowUpRight size={22} />} active={path === '/withdraw'} />
    </nav>
  )
}

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
}) {
  return (
    <Link
      to={href}
      className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-semibold tracking-wide transition-colors ${
        active ? 'text-green-500' : 'text-gray-400'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
