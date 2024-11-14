import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getOwnerTheaters, createTheater, getTheaters } from '../lib/api'
import { Building2, Plus, MapPin, Users } from 'lucide-react'
import { useAuthStore } from '../stores/auth'
import { Link } from '@tanstack/react-router'
import type { Theater } from '../types'

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
        {theaters?.map((theater: Theater) => (
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
            <Link 
              to={`/theaters/${theater.id}/shows`}
              className="block w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 text-center"
            >
              View Shows
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TheaterOwnerTheaters() {
  const [isAddingTheater, setIsAddingTheater] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const { data: theaters, isLoading } = useQuery({
    queryKey: ['owner-theaters', user?.id],
    queryFn: () => getOwnerTheaters(user?.id)
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)

    try {
      if (!user?.id || user.role !== 'owner') {
        throw new Error('You must be logged in as a theater owner')
      }

      const theater = {
        name: formData.get('name') as string,
        location: formData.get('location') as string,
        capacity: Number(formData.get('capacity')),
        owner_id: user.id
      }

      // Validate data before sending
      if (!theater.name || !theater.location || !theater.capacity) {
        throw new Error('Please fill in all fields')
      }

      await createTheater(theater)
      queryClient.invalidateQueries({
        queryKey: ['owner-theaters', user.id]
      })
      setIsAddingTheater(false)
      e.currentTarget.reset()
    } catch (err: any) {
      console.error('Theater creation failed:', err)
      setError(err.message || 'Failed to create theater')
    }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Theaters</h1>
        <button
          onClick={() => setIsAddingTheater(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Theater
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {isAddingTheater && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Theater Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                Seating Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingTheater(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add Theater
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {theaters?.map((theater: Theater) => (
          <div key={theater.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{theater.name}</h2>
              <span className={`px-2 py-1 rounded text-sm ${
                theater.status === 'approved' ? 'bg-green-100 text-green-800' :
                theater.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {theater.status}
              </span>
            </div>
            <div className="space-y-4">
              <div className="text-gray-600 space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{theater.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Capacity: {theater.capacity} seats</span>
                </div>
              </div>
              {theater.status === 'approved' && (
                <Link 
                  to={`/owner/theaters/${theater.id}/shows`}
                  className="block w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 text-center"
                >
                  Manage Shows
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}