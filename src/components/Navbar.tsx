import { Link } from '@tanstack/react-router'
import { Film, Menu, User, X } from 'lucide-react'
import { useState } from 'react'
import { AuthButtons } from './AuthButtons'
import { useAuthStore } from '../stores/auth'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuthStore()
  const isAdmin = user?.role == 'admin'

  const NavigationItems = () => (
    <>
      <Link to="/movies" className="text-gray-600 hover:text-indigo-600">Movies</Link>
      <Link to="/theaters" className="text-gray-600 hover:text-indigo-600">Theaters</Link>
      {user && !isAdmin && (
        <Link to="/bookings" className="text-gray-600 hover:text-indigo-600">
          My Bookings
        </Link>
      )}
      {user && isAdmin && (
        <span className="text-gray-400 cursor-not-allowed" title="Not available for admin users">
          My Bookings
        </span>
      )}
    </>
  )

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Film className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">MovieTix</span>
            </Link>
          </div>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationItems />
            {user ? (
              <Link to="/profile" className="flex items-center text-gray-600 hover:text-indigo-600">
                <User className="h-5 w-5" />
              </Link>
            ) : null}
            <AuthButtons />
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <NavigationItems />
            {user && (
              <Link to="/profile" className="block py-2 text-gray-600">Profile</Link>
            )}
            <div className="py-2">
              <AuthButtons />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}