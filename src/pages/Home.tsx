import { Link } from '@tanstack/react-router'
import { Film, MapPin, Ticket } from 'lucide-react'

export function Home() {
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

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Film className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Latest Movies</h2>
          <p className="text-gray-600 mb-4">
            Browse the newest releases and upcoming movies
          </p>
          <Link to="/movies" className="text-indigo-600 hover:text-indigo-800">
            View Movies →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <MapPin className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Find Theaters</h2>
          <p className="text-gray-600 mb-4">
            Discover theaters near you with the best experience
          </p>
          <Link to="/theaters" className="text-indigo-600 hover:text-indigo-800">
            Find Theaters →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Ticket className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Quick Booking</h2>
          <p className="text-gray-600 mb-4">
            Fast and easy ticket booking for your convenience
          </p>
          <Link to="/movies" className="text-indigo-600 hover:text-indigo-800">
            Book Now →
          </Link>
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