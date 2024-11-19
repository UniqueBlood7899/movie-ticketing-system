import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getOwnerTheaters, createTheater, getTheaters, getTheaterShows, createShow, deleteShow, getMovies } from '../lib/api'
import { Building2, Plus, MapPin, Users, Clock, ListVideo, Trash2 } from 'lucide-react'
import { useAuthStore } from '../stores/auth'
import { Link } from '@tanstack/react-router'
import type { Theater, Movie, Show } from '../types'

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
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const { data: theaters, isLoading: theatersLoading } = useQuery({
    queryKey: ['owner-theaters', user?.id],
    queryFn: () => getOwnerTheaters(user?.id),
    enabled: !!user?.id
  })

  const { data: movies } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies
  })

  const { data: theaterShows } = useQuery({
    queryKey: ['theater-shows', selectedTheater?.id],
    queryFn: () => getTheaterShows(selectedTheater?.id as number),
    enabled: !!selectedTheater?.id
  })

  const createTheaterMutation = useMutation({
    mutationFn: createTheater,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-theaters'] })
      setIsAddingTheater(false)
    }
  })

  const createShowMutation = useMutation({
    mutationFn: createShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theater-shows'] })
      setShowForm(false)
      setSelectedMovie(null)
      setShowManageModal(false)
    }
  })

  const deleteShowMutation = useMutation({
    mutationFn: deleteShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theater-shows'] })
    }
  })

  const handleTheaterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)

    try {
      if (!user?.id) {
        throw new Error('You must be logged in as a theater owner')
      }

      const theater = {
        name: formData.get('name') as string,
        location: formData.get('location') as string,
        capacity: Number(formData.get('capacity')),
        owner_id: user.id
      }

      if (!theater.name || !theater.location || !theater.capacity) {
        throw new Error('Please fill in all fields')
      }

      await createTheaterMutation.mutateAsync(theater)
      e.currentTarget.reset()
    } catch (err: any) {
      setError(err.message || 'Failed to create theater')
    }
  }

  const handleShowSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const showDate = formData.get('show_date') as string
    const showTime = formData.get('show_time') as string
    const price = Number(formData.get('price'))

    if (!selectedMovie?.id || !selectedTheater?.id || !showDate || !showTime || !price) {
      setError('Please fill in all fields')
      return
    }

    try {
      const combinedDateTime = `${showDate}T${showTime}:00`
      await createShowMutation.mutateAsync({
        movie_id: selectedMovie.id,
        theater_id: selectedTheater.id,
        show_time: combinedDateTime,
        price: price
      })
    } catch (err: any) {
      setError(err.message || 'Failed to create show')
    }
  }

  if (theatersLoading) {
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
          <form onSubmit={handleTheaterSubmit} className="space-y-4">
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
                disabled={createTheaterMutation.isPending}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {createTheaterMutation.isPending ? 'Adding...' : 'Add Theater'}
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
            {theater.status === 'approved' && (
              <button 
                onClick={() => {
                  setSelectedTheater(theater)
                  setShowManageModal(true)
                }}
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center"
              >
                <ListVideo className="h-4 w-4 mr-2" />
                Manage Shows
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Show Management Modal */}
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
              {theaterShows?.length === 0 ? (
                <p className="text-gray-500">No shows scheduled yet.</p>
              ) : (
                theaterShows?.map((show: Show) => (
                  <div key={show.id} className="flex items-center justify-between border p-2 rounded mb-2">
                    <div className="flex-1">
                      <p className="font-medium">{show.movie?.title}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{new Date(show.show_time).toLocaleString()}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">₹{show.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this show?')) {
                          deleteShowMutation.mutate(show.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                      disabled={deleteShowMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Add New Show</h3>
                {showForm && (
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {showForm && selectedMovie ? (
                <form onSubmit={handleShowSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="show_date" className="block text-sm font-medium text-gray-700">
                        Show Date
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
                        Show Time
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
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={createShowMutation.isPending}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {createShowMutation.isPending ? 'Adding...' : 'Add Show'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  {movies?.map((movie: Movie) => (
                    <div key={movie.id} className="flex items-center justify-between border p-2 rounded">
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
                        }}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                      >
                        Add Show
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}