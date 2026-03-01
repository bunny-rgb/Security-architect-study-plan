'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/learn', icon: '📚', label: 'Learn' },
    { href: '/battle-room', icon: '⚔️', label: 'War Room' },
    { href: '/profile', icon: '👤', label: 'Profile' }
  ]
  
  const sidebarItems = [
    { href: '/', icon: '📊', label: 'Dashboard' },
    { href: '/learn', icon: '📚', label: 'Learning Path' },
    { href: '/battle-room', icon: '⚔️', label: 'Live Scenarios', badge: 'New' },
    { href: '/progress', icon: '📈', label: 'Progress Tracker' },
    { href: '/achievements', icon: '🏆', label: 'Achievements' },
    { href: '/profile', icon: '👤', label: 'Profile' },
    { href: '/settings', icon: '⚙️', label: 'Settings' }
  ]
  
  return (
    <>
      {/* Bottom Navigation - Mobile */}
      <nav className="bottom-nav hide-desktop">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* Sidebar Navigation - Desktop */}
      <aside className="sidebar hide-mobile">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-accent-purple rounded-lg flex items-center justify-center text-xl">
              🛡️
            </div>
            <div>
              <h2 className="text-lg font-bold">SecArch</h2>
              <p className="text-xs text-secondary">Academy</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-4">
            Learning Path
          </div>
          {sidebarItems.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="badge badge-progress text-xs">{item.badge}</span>
              )}
            </Link>
          ))}
          
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-4 mt-6">
            Performance
          </div>
          {sidebarItems.slice(3, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-4 mt-6">
            Account
          </div>
          {sidebarItems.slice(5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  )
}
