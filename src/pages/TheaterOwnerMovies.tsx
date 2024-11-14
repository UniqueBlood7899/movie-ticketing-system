// src/pages/TheaterOwnerMovies.tsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMovies, getOwnerTheaters, createShow, createMovie, getTheaterShows, deleteShow } from '../lib/api'
import { Clock, Calendar, Plus, Film, ListVideo, Trash2 } from 'lucide-react'
import { useAuthStore } from '../stores/auth'
import type { Movie, Theater, Show } from '../types'

export function TheaterOwnerMovies() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMovieForm, setIsMovieForm] = useState(false)
  const [movieFormData, setMovieFormData] = useState({
    title: '',
    description: '',
    duration: '',
    genre: '', // Add missing genre field
    release_date: '',
    image_url: ''
  })
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null)
  const [showManageModal, setShowManageModal] = useState(false)

  const { data: movies, isLoading: moviesLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
    enabled: !!user // Only fetch if user is logged in
  })

  const { data: theaters, isLoading: theatersLoading, error: theatersError } = useQuery({
    queryKey: ['owner-theaters', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID is required')
      const theaters = await getOwnerTheaters(user.id)
      return theaters as Theater[]
    },
    select: (theaters) => theaters.filter((t: Theater) => t.status === 'approved'),
    enabled: !!user?.id,
    retry: false
  })

  const { data: theaterShows, isLoading: showsLoading } = useQuery<Show[]>({
    queryKey: ['theater-shows', selectedTheater?.id],
    queryFn: () => selectedTheater ? getTheaterShows(selectedTheater.id) : Promise.resolve([]),
    enabled: !!selectedTheater
  })

  const createShowMutation = useMutation({
    mutationFn: (showData: {
      movie_id: number;
      theater_id: number;
      show_time: string;
      price: number;
    }) => createShow(showData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theater-shows'] })
      setShowForm(false)
      setSelectedMovie(null)
      setError(null)
      setShowManageModal(false) // Close modal after successful creation
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to create show')
    }
  })

  const createMovieMutation = useMutation({
    mutationFn: (movieData: Partial<Movie>) => createMovie(movieData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] })
      setIsMovieForm(false)
      setMovieFormData({
        title: '',
        description: '',
        duration: '',
        genre: '',
        release_date: '',
        image_url: ''
      })
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to create movie')
    }
  })

  // Add delete show mutation
  const deleteShowMutation = useMutation({
    mutationFn: (showId: number) => deleteShow(showId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theater-shows'] })
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to delete show')
    }
  })

  const handleShowSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const showTime = formData.get('show_time') as string
    const price = Number(formData.get('price'))
    const theaterId = Number(formData.get('theater_id'))

    if (!selectedMovie?.id || !theaterId || !showTime || !price) {
      setError('Please fill in all fields')
      return
    }

    const showData = {
      movie_id: selectedMovie.id,
      theater_id: theaterId,
      show_time: showTime,
      price: price
    }

    try {
      await createShowMutation.mutateAsync(showData)
    } catch (err) {
      // Error will be handled by mutation error callback
    }
  }

  const handleMovieSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const movieData = {
      ...movieFormData,
      duration: parseInt(movieFormData.duration) || 0,
      admin_id: user?.id // Add admin_id for movie creation
    }

    if (!movieData.title || !movieData.description || !movieData.duration || 
        !movieData.release_date || !movieData.genre) {
      setError('Please fill in all required fields')
      return
    }

    createMovieMutation.mutate(movieData)
  }

  if (moviesLoading || theatersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (theatersError) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Movies Catalog</h1>
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <p className="text-red-800">
            Failed to load theaters: {(theatersError as Error).message}
          </p>
        </div>
      </div>
    )
  }

  if (!theaters?.length) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Movies Catalog</h1>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <p className="text-yellow-800">
            You don't have any approved theaters yet. Please wait for admin approval or add a new theater.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Movies Catalog</h1>
        <button
          onClick={() => setIsMovieForm(!isMovieForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {isMovieForm ? 'View Movies' : 'Add New Movie'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {isMovieForm ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Movie</h2>
          <form onSubmit={handleMovieSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Movie Title
              </label>
              <input
                type="text"
                id="title"
                value={movieFormData.title}
                onChange={(e) => setMovieFormData({...movieFormData, title: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={movieFormData.description}
                onChange={(e) => setMovieFormData({...movieFormData, description: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={movieFormData.duration}
                  onChange={(e) => setMovieFormData({...movieFormData, duration: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                  min="1"
                />
              </div>
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                  Genre
                </label>
                <input
                  type="text"
                  id="genre"
                  value={movieFormData.genre}
                  onChange={(e) => setMovieFormData({...movieFormData, genre: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                  placeholder="Action, Drama, Comedy, etc."
                />
              </div>
            </div>
            <div>
              <label htmlFor="release_date" className="block text-sm font-medium text-gray-700">
                Release Date
              </label>
              <input
                type="date"
                id="release_date"
                value={movieFormData.release_date}
                onChange={(e) => setMovieFormData({...movieFormData, release_date: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                id="image_url"
                value={movieFormData.image_url}
                onChange={(e) => setMovieFormData({...movieFormData, image_url: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="https://example.com/movie-image.jpg"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsMovieForm(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMovieMutation.isPending}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {createMovieMutation.isPending ? 'Creating...' : 'Create Movie'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {showForm && selectedMovie && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Create Show for {selectedMovie.title}</h2>
              <form onSubmit={handleShowSubmit} className="space-y-4">
                <div>
                  <label htmlFor="theater_id" className="block text-sm font-medium text-gray-700">
                    Select Theater
                  </label>
                  <select
                    id="theater_id"
                    name="theater_id"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">Select a theater</option>
                    {theaters && theaters.length > 0 ? (
                      theaters.map((theater: Theater) => (
                        <option key={theater.id} value={theater.id}>
                          {theater.name} ({theater.location}) - {theater.capacity} seats
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No approved theaters available</option>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="show_time" className="block text-sm font-medium text-gray-700">
                    Show Time
                  </label>
                  <input
                    type="datetime-local"
                    id="show_time"
                    name="show_time"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
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
                    onClick={() => {
                      setShowForm(false)
                      setSelectedMovie(null)
                      setError(null)
                    }}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createShowMutation.isPending}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                  >
                    {createShowMutation.isPending ? 'Creating...' : 'Create Show'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {showManageModal && selectedTheater && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Manage Shows - {selectedTheater.name}
                  </h2>
                  <button
                    onClick={() => {
                      setShowManageModal(false)
                      setSelectedTheater(null)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Current Shows</h3>
                  {theaterShows?.map((show: Show) => (
                    <div key={show.id} className="flex items-center justify-between border p-2 rounded">
                      <div className="flex-1">
                        <p className="font-medium flex items-center">
                          {show.movie?.title || 'Unknown Movie'}
                          {show.movie?.genre && (
                            <span className="ml-2 text-sm text-gray-500">({show.movie.genre})</span>
                          )}
                        </p>
                        <div className="flex items-center text-sm text-gray-600 mt-1 flex-wrap">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-2">{new Date(show.show_time).toLocaleString()}</span>
                          <span className="mx-2">•</span>
                          <span className="font-medium mr-2">₹{show.price}</span>
                          {show.movie?.duration && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{show.movie.duration} mins</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this show?')) {
                              deleteShowMutation.mutate(show.id)
                            }
                          }}
                          className={`text-red-600 hover:text-red-800 ml-4 ${
                            deleteShowMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete show"
                          disabled={deleteShowMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Add New Show</h3>
                  {movies?.map((movie: Movie) => (
                    <div key={movie.id} className="flex items-center justify-between border p-2 rounded mb-2">
                      <div className="flex items-center">
                        <img
                          src={movie.image_url || 'https://via.placeholder.com/50'}
                          alt={movie.title}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium">{movie.title}</p>
                          <p className="text-sm text-gray-600">{movie.duration} mins</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedMovie(movie)
                          setShowForm(true)
                          setShowManageModal(false)
                        }}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                      >
                        Add Show
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {theaters?.map((theater: Theater) => (
              <div key={theater.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{theater.name}</h2>
                  <p className="text-gray-600 mb-4">{theater.location}</p>
                  <p className="text-sm text-gray-500 mb-4">Capacity: {theater.capacity} seats</p>
                  <button 
                    onClick={() => {
                      setSelectedTheater(theater)
                      setShowManageModal(true)
                    }}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center"
                  >
                    <ListVideo className="h-4 w-4 mr-1" />
                    Manage Shows
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Available Movies</h2>
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
                  <button 
                    onClick={() => {
                      setSelectedMovie(movie)
                      setShowForm(true)
                    }}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-1 inline" />
                    Add Show
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}