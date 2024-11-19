import { useQuery } from '@tanstack/react-query'
import { getBookings } from '../lib/api'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { useAuthStore } from '../stores/auth'
import { Navigate } from '@tanstack/react-router'
import type { Booking } from '../types'

export function Bookings() {
  const { user } = useAuthStore()
  
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    enabled: !!user // Only fetch when user is authenticated
  })

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <div className="space-y-6">
        {bookings?.map((booking: Booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{booking.show.movie.title}</h2>
              <span className="text-gray-500">Booking ID: #{booking.id}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{new Date(booking.show.show_time).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{new Date(booking.show.show_time).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{booking.show.theater.name}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Seats: {Array.isArray(booking.seats) ? 
                  booking.seats.join(', ') : 
                  typeof booking.seats === 'string' ? 
                    booking.seats : 
                    JSON.stringify(booking.seats)
                }</span>
                <span className="font-semibold">Total: ₹{booking.total_amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}