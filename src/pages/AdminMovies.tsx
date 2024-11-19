import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMovies, createMovie } from '../lib/api'
import { Film, Plus, Pencil, Trash2, Calendar, Clock } from 'lucide-react'
import type { Movie } from '../types'
import { useAuthStore } from '../stores/auth'

export function AdminMovies() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [isAddingMovie, setIsAddingMovie] = useState(false)
  const [error, setError] = useState('')

  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
  })

  const createMovieMutation = useMutation({
    mutationFn: createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] })
      setIsAddingMovie(false)
      setError('')
    },
    onError: (error: Error) => {
      setError(error.message)
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const movieData = {
        title: formData.get('title') as string,
        duration: Number(formData.get('duration')),
        genre: formData.get('genre') as string,
        description: formData.get('description') as string,
        image_url: formData.get('image_url') as string,
        release_date: formData.get('release_date') as string,
        admin_id: user?.id
      }

      if (!movieData.title || !movieData.duration || !movieData.genre || !movieData.release_date) {
        throw new Error('Please fill in all required fields')
      }

      await createMovieMutation.mutateAsync(movieData)
    } catch (err: any) {
      setError(err.message || 'Failed to create movie')
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Movies</h1>
        <button
          onClick={() => setIsAddingMovie(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Movie
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {isAddingMovie && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                  Genre *
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                placeholder="https://example.com/movie-image.jpg"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="release_date" className="block text-sm font-medium text-gray-700">
                Release Date *
              </label>
              <input
                type="date"
                id="release_date"
                name="release_date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingMovie(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMovieMutation.isPending}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {createMovieMutation.isPending ? 'Adding Movie...' : 'Add Movie'}
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
          {movies?.map((movie: Movie) => (
            <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={movie.image_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{movie.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{movie.duration} mins</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(movie.release_date).toLocaleDateString()}</span>
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}