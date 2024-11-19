// src/pages/Movies.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMovies, getTheaterShows } from '../lib/api'
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { Movie, Theater, Show } from '../types'
import { useAuthStore } from '../stores/auth'

export function Movies() {
  const navigate = useNavigate()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null)
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const { user } = useAuthStore()

  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies
  })

  const { data: theaterShows } = useQuery({
    queryKey: ['theater-shows', selectedMovie?.id],
    queryFn: () => getTheaterShows(selectedMovie?.id as number),
    enabled: !!selectedMovie?.id
  })

  const handleMovieSelect = (movie: Movie) => {
    if (expandedCard === movie.id) {
      setExpandedCard(null)
      setSelectedMovie(null)
      setSelectedTheater(null)
      setSelectedShow(null)
    } else {
      setExpandedCard(movie.id)
      setSelectedMovie(movie)
      setSelectedTheater(null)
      setSelectedShow(null)
    }
  }

  const handleTheaterSelect = (theater: Theater) => {
    setSelectedTheater(theater)
  }

  const handleShowSelect = (show: Show) => {
    setSelectedShow(show)
  }

  const handleBookNow = () => {
    if (!selectedShow) {
      return
    }

    if (user) {
      // User is logged in, navigate directly to booking form
      navigate({ 
        to: '/booking/new',
        search: { 
          showId: selectedShow.id.toString()
          // Remove other params as they're not needed and causing issues
        }
      })
    } else {
      // User is not logged in, prompt to login
      if (window.confirm('Please login to book tickets.')) {
        navigate({ to: '/login' })
      }
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Now Showing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movies?.map((movie: Movie) => (
          <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={movie.image_url || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
              alt={movie.title}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => handleMovieSelect(movie)}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
                {movie.title}
                <button onClick={() => handleMovieSelect(movie)}>
                  {expandedCard === movie.id ? <ChevronUp /> : <ChevronDown />}
                </button>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{movie.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>{movie.duration} mins</span>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>

              {expandedCard === movie.id && (
                <div className="space-y-4 mt-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Theater
                    </label>
                    <select
                      value={selectedTheater?.id || ''}
                      onChange={(e) => {
                        const theater = theaterShows?.find(show => show.theater.id === Number(e.target.value))?.theater
                        if (theater) handleTheaterSelect(theater)
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="">Select a theater</option>
                      {Array.from(new Set(theaterShows?.map(show => show.theater.id))).map(theaterId => {
                        const theater = theaterShows?.find(show => show.theater.id === theaterId)?.theater
                        return theater ? (
                          <option key={theater.id} value={theater.id}>
                            {theater.name} ({theater.location})
                          </option>
                        ) : null
                      })}
                    </select>
                  </div>

                  {selectedTheater && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Show
                      </label>
                      <select
                        value={selectedShow?.id || ''}
                        onChange={(e) => {
                          const show = theaterShows?.find(s => s.id === Number(e.target.value))
                          if (show) handleShowSelect(show)
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        <option value="">Select a show</option>
                        {theaterShows
                          ?.filter(show => show.theater.id === selectedTheater.id)
                          .map(show => (
                            <option key={show.id} value={show.id}>
                              {new Date(show.show_time).toLocaleString()} - ₹{show.price}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {selectedShow && (
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-lg font-semibold">
                        Total: ₹{selectedShow.price}
                      </div>
                      <button
                        onClick={handleBookNow}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                      >
                        Book Now
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}