import { useQuery } from '@tanstack/react-query'
import { getTheaters } from '../lib/api'
import { MapPin, Users } from 'lucide-react'

export function Theaters() {
  const { data: theaters, isLoading } = useQuery({
    queryKey: ['theaters'],
    queryFn: getTheaters,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Theaters</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {theaters?.map((theater: any) => (
          <div key={theater.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{theater.name}</h2>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{theater.location}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <Users className="h-5 w-5 mr-2" />
              <span>Capacity: {theater.capacity} seats</span>
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
              View Shows
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}