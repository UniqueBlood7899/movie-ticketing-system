import { Navigate, useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Film, Building2, Ticket } from 'lucide-react'
import { useAuthStore } from '../stores/auth'

export function Home() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  
  if (user?.role === 'owner') {
    return <Navigate to="/owner/dashboard" />
  }

  const handleBookNow = () => {
    if (!user) {
      if (window.confirm('Please login to book tickets.')) {
        navigate({ to: '/login' })
      }
      return
    }
    navigate({ to: '/movies' })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Book Your Movie Experience
        </h1>
        <p className="text-xl text-gray-600">
          Find and book tickets for the latest movies in your favorite theaters
        </p>
      </div>

      {/* Single card with full width */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Ticket className="h-16 w-16 text-indigo-600 mb-6 mx-auto" />
          <h2 className="text-2xl font-semibold mb-4 text-center">Quick Booking</h2>
          <p className="text-gray-600 mb-6 text-center text-lg">
            Fast and easy ticket booking for your convenience
          </p>
          <button 
            onClick={handleBookNow}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 text-lg font-medium"
          >
            Book Now →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="Cinema"
          className="w-full h-64 object-cover"
        />
      </div>
    </div>
  )
}