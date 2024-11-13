// src/pages/TheaterOwnerMovies.tsx
import { useQuery } from '@tanstack/react-query'
import { getMovies } from '../lib/api'
import { Clock, Calendar } from 'lucide-react'
import type { Movie } from '../types'

export function TheaterOwnerMovies() {
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies
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
      <h1 className="text-3xl font-bold mb-8">Movies at My Theater</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                Add Show
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}