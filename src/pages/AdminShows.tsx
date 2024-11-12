//src/pages/AdminShows.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getShows, getMovies, getTheaters } from '../lib/api'
import { Clock, Plus, Pencil, Trash2, Calendar } from 'lucide-react'
import type { Show, Movie, Theater } from '../types'

export function AdminShows() {
  const [isAddingShow, setIsAddingShow] = useState(false)
  const { data: shows, isLoading: showsLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: getShows,
  })
  const { data: movies } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
  })
  const { data: theaters } = useQuery({
    queryKey: ['theaters'],
    queryFn: getTheaters,
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Shows</h1>
        <button
          onClick={() => setIsAddingShow(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Show
        </button>
      </div>

      {isAddingShow && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <form className="space-y-4">
            <div>
              <label htmlFor="movie_id" className="block text-sm font-medium text-gray-700">
                Movie
              </label>
              <select
                id="movie_id"
                name="movie_id"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select a movie</option>
                {movies?.map((movie: Movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="theater_id" className="block text-sm font-medium text-gray-700">
                Theater
              </label>
              <select
                id="theater_id"
                name="theater_id"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select a theater</option>
                {theaters?.map((theater: Theater) => (
                  <option key={theater.id} value={theater.id}>
                    {theater.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="show_date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="show_date"
                  name="show_date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="show_time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  id="show_time"
                  name="show_time"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Ticket Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingShow(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Save Show
              </button>
            </div>
          </form>
        </div>
      )}

      {showsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows?.map((show: Show) => (
            <div key={show.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{show.movie.title}</h2>
              <p className="text-gray-600 mb-4">{show.theater.name}</p>
              <div className="text-gray-600 space-y-2 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{new Date(show.show_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{show.show_time}</span>
                </div>
                <div className="font-semibold">
                  Price: ₹{show.price}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button className="p-2 text-blue-600 hover:text-blue-800">
                  <Pencil className="h-5 w-5" />
                </button>
                <button className="p-2 text-red-600 hover:text-red-800">
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