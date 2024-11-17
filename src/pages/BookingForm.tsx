// src/pages/BookingForm.tsx
import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getShow, createBooking } from '../lib/api'
import type { Show } from '../types'

export function BookingForm() {
  const navigate = useNavigate()
  const search = useSearch()
  const showId = Number(search.showId)
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const { data: show } = useQuery<Show>({
    queryKey: ['show', showId],
    queryFn: () => getShow(showId.toString()),
    enabled: !!showId
  })

  const bookingMutation = useMutation({
    mutationFn: (bookingData: {
      show_id: number
      seats: string[]
    }) => createBooking(bookingData),
    onSuccess: () => {
      navigate({ to: '/bookings' })
    },
    onError: (error: Error) => {
      setError(error.message)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!showId || selectedSeats.length === 0) {
      setError('Please select seats')
      return
    }

    bookingMutation.mutate({
      show_id: showId,
      seats: selectedSeats
    })
  }

  if (!show) return null

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Seats (comma separated)
          </label>
          <input
            type="text"
            value={selectedSeats.join(', ')}
            onChange={(e) => setSelectedSeats(e.target.value.split(',').map(s => s.trim()))}
            placeholder="A1, A2, A3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-lg font-semibold">
            Total Amount: ₹{show.price * selectedSeats.length}
          </div>
          <button
            type="submit"
            disabled={bookingMutation.isPending}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}