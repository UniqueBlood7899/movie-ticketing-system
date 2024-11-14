//src/pages/AdminTheaters.tsx
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getTheaters, updateTheaterStatus, deleteTheater } from '../lib/api'
import { Building2, Plus, Pencil, Trash2, MapPin, Users } from 'lucide-react'
import type { Theater } from '../types'

export function AdminTheaters() {
  const queryClient = useQueryClient()
  const [isAddingTheater, setIsAddingTheater] = useState(false)
  const { data: theaters, isLoading } = useQuery({
    queryKey: ['theaters'],
    queryFn: getTheaters,
  })

  const handleStatusUpdate = async (theaterId: number, status: 'approved' | 'rejected') => {
    try {
      await updateTheaterStatus(theaterId, status)
      queryClient.invalidateQueries({
        queryKey: ['theaters']
      })
    } catch (error) {
      console.error('Failed to update theater status:', error)
    }
  }

  const handleDelete = async (theaterId: number) => {
    if (!window.confirm('Are you sure you want to delete this theater?')) return
    
    try {
      await deleteTheater(theaterId)
      queryClient.invalidateQueries(['theaters'])
    } catch (error) {
      console.error('Failed to delete theater:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Theaters</h1>
        <button
          onClick={() => setIsAddingTheater(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Theater
        </button>
      </div>

      {isAddingTheater && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <form className="space-y-4">
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
                Save Theater
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : (
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
              <div className="text-gray-600 space-y-2 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{theater.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Capacity: {theater.capacity} seats</span>
                </div>
              </div>
              {theater.status === 'pending' && (
                <div className="flex justify-end space-x-2 mb-4">
                  <button
                    onClick={() => handleStatusUpdate(theater.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(theater.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
              <div className="flex justify-end">
                <button 
                  onClick={() => handleDelete(theater.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}