//src/pages/AdminHome.tsx
import { Link, Navigate } from '@tanstack/react-router'
import { Film, Building2, UtensilsCrossed, Clock } from 'lucide-react'
import { useAuthStore } from '../stores/auth'

export function AdminHome() {
  const { user } = useAuthStore()
  
  // Protect admin route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" search={{ role: 'admin' }} />
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Manage movies, theaters, shows and food items
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Film className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Manage Movies</h2>
          <p className="text-gray-600 mb-4">
            Add, edit or remove movies from the catalog
          </p>
          <Link 
            to="/admin/movies" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            Manage Movies →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Building2 className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Manage Theaters</h2>
          <p className="text-gray-600 mb-4">
            Add new theaters and manage existing ones
          </p>
          <Link 
            to="/admin/theaters" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            Manage Theaters →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Clock className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Manage Shows</h2>
          <p className="text-gray-600 mb-4">
            Schedule and manage movie shows
          </p>
          <Link 
            to="/admin/shows" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            Manage Shows →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <UtensilsCrossed className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Manage Food</h2>
          <p className="text-gray-600 mb-4">
            Add and manage food items for theaters
          </p>
          <Link 
            to="/admin/food" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            Manage Food →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Booking Logs</h2>
          <p className="text-gray-600 mb-4">
            View logs of all booking actions
          </p>
          <Link 
            to="/admin/booking-logs" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            View Booking Logs →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">User Booking Logs</h2>
          <p className="text-gray-600 mb-4">
            View booking logs for specific users
          </p>
          <Link 
            to="/admin/user-booking-logs" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            View User Logs →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="Admin Dashboard"
          className="w-full h-64 object-cover"
        />
      </div>
    </div>
  )
}