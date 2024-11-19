import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getShow, createBooking, getFoodItems } from '../lib/api'
import { Ticket, UtensilsCrossed, Plus, Minus } from 'lucide-react'
import type { Show, Food } from '../types'

export function BookingForm() {
  const navigate = useNavigate()
  const { showId } = useSearch({ from: '/booking/new' })
  const showIdNumber = Number(showId)
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [foodSelections, setFoodSelections] = useState<{[key: number]: number}>({})
  const [error, setError] = useState<string | null>(null)

  const { data: show, isLoading: showLoading } = useQuery<Show>({
    queryKey: ['show', showIdNumber],
    queryFn: () => getShow(showId),
    enabled: !!showId
  })

  const { data: foodItems } = useQuery({
    queryKey: ['food-items'],
    queryFn: getFoodItems
  })

  const bookingMutation = useMutation({
    mutationFn: (bookingData: {
      show_id: number
      seats: string[]
      food_items?: { food_id: number; quantity: number }[]
    }) => createBooking(bookingData),
    onSuccess: () => {
      navigate({ to: '/bookings' })
    }
  })

  const handleSeatSelection = (seat: string) => {
    setSelectedSeats(prev => 
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    )
  }

  const updateFoodQuantity = (foodId: number, increment: boolean) => {
    setFoodSelections(prev => {
      const current = prev[foodId] || 0
      const newQuantity = increment ? current + 1 : Math.max(0, current - 1)
      return {
        ...prev,
        [foodId]: newQuantity
      }
    })
  }

  const calculateTotal = () => {
    const ticketTotal = (show?.price || 0) * selectedSeats.length
    const foodTotal = Object.entries(foodSelections).reduce((total, [foodId, quantity]) => {
      const food = foodItems?.find(f => f.id === Number(foodId))
      return total + (food?.price || 0) * quantity
    }, 0)
    return ticketTotal + foodTotal
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!showId || selectedSeats.length === 0) {
      setError('Please select at least one seat')
      return
    }

    const foodItems = Object.entries(foodSelections)
      .filter(([_, quantity]) => quantity > 0)
      .map(([foodId, quantity]) => ({
        food_id: Number(foodId),
        quantity
      }))

    bookingMutation.mutate({
      show_id: showIdNumber,
      seats: selectedSeats,
      food_items: foodItems
    })
  }

  if (showLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!show) return null

  // Generate seat layout (5 rows, 8 seats per row)
  const seatLayout = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 8 }, (_, seat) => `${String.fromCharCode(65 + row)}${seat + 1}`)
  )

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Ticket className="h-5 w-5 mr-2" />
            Select Seats
          </h2>
          
          <div className="mb-8">
            <div className="w-full h-4 bg-gray-300 rounded mb-8 text-center text-sm text-gray-600">
              Screen
            </div>
            
            <div className="grid gap-4">
              {seatLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2">
                  {row.map((seat) => (
                    <button
                      key={seat}
                      type="button"
                      onClick={() => handleSeatSelection(seat)}
                      className={`w-8 h-8 rounded ${
                        selectedSeats.includes(seat)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Selected seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
          </div>
        </div>

        {foodItems && foodItems.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <UtensilsCrossed className="h-5 w-5 mr-2" />
              Add Food & Beverages
            </h2>
            
            <div className="space-y-4">
              {foodItems.map((food: Food) => (
                <div key={food.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{food.name}</h3>
                    <p className="text-sm text-gray-600">₹{food.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => updateFoodQuantity(food.id, false)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">
                      {foodSelections[food.id] || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateFoodQuantity(food.id, true)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span>₹{calculateTotal()}</span>
          </div>
          
          <button
            type="submit"
            disabled={bookingMutation.isPending || selectedSeats.length === 0}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {bookingMutation.isPending ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}