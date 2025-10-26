import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { user } = useAuth()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['Admin', 'Trainer', 'Member'] },
    { path: '/members', label: 'Members', roles: ['Admin', 'Trainer'] },
    { path: '/trainers', label: 'Trainers', roles: ['Admin'] },
    { path: '/classes', label: 'Classes', roles: ['Admin', 'Trainer', 'Member'] },
    { path: '/bookings', label: 'Bookings', roles: ['Admin', 'Trainer', 'Member'] },
    { path: '/payments', label: 'Payments', roles: ['Admin'] }
  ]

  return (
    <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {navItems.filter(item => item.roles.includes(user?.role)).map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar