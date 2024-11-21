import axios from 'axios'
import type { Movie, Theater, Show, Food } from '../types'

export const api = axios.create({
  baseURL: 'http://localhost:5001/api',
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage')
  if (token) {
    const { state } = JSON.parse(token)
    if (state.token) {
      config.headers.Authorization = `Bearer ${state.token}`
    }
  }
  return config
})

// Movies
export const getMovies = () => api.get<Movie[]>('/movies').then(res => res.data)
export const getMovie = (id: string) => api.get<Movie>(`/movies/${id}`).then(res => res.data)
export const createMovie = (movieData: Partial<Movie>) => 
  api.post<Movie>('/movies', movieData).then(res => res.data)
export const updateMovie = (id: number, data: Partial<Movie>) => 
  api.put<Movie>(`/movies/${id}`, data).then(res => res.data)
export const deleteMovie = async (id: number) => {
  try {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to delete movie');
  }
}

// Theaters
export const getTheaters = () => api.get<Theater[]>('/theaters').then(res => res.data)
export const getTheater = (id: string) => api.get<Theater>(`/theaters/${id}`).then(res => res.data)
export const createTheater = (data: Partial<Theater>) => 
  api.post<Theater>('/theaters', data).then(res => res.data)
export const updateTheaterStatus = (id: number, status: string) => 
  api.patch(`/theaters/${id}/status`, { status }).then(res => res.data)
export const getOwnerTheaters = (ownerId: number) => 
  api.get<Theater[]>(`/theaters/owner/${ownerId}`).then(res => res.data)
export const deleteTheater = (id: number) => 
  api.delete(`/theaters/${id}`).then(res => res.data)

// Shows
export const getShows = () => api.get<Show[]>('/shows').then(res => res.data)
export const getShow = (id: string) => api.get<Show>(`/shows/${id}`).then(res => res.data)
export const getTheaterShows = (theaterId: number) => 
  api.get<Show[]>(`/theaters/${theaterId}/shows`).then(res => res.data)
export const createShow = (data: {
  movie_id: number
  theater_id: number
  show_time: string
  price: number
}) => api.post<Show>('/shows', data).then(res => res.data)
export const deleteShow = (id: number) => 
  api.delete(`/shows/${id}`).then(res => res.data)

// Bookings
export const createBooking = (data: any) => api.post('/bookings', data).then(res => res.data)
export const getBookings = () => api.get('/bookings').then(res => res.data)
export const getBookingLogs = () => api.get('/booking-logs').then(res => res.data)

// Users
export const login = (data: any) => api.post('/users/login', data).then(res => res.data)
export const register = (data: any) => api.post('/users/register', data).then(res => res.data)

// Admin
export const adminLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post('/users/admin/login', data)
    if (response.data && response.data.token) {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          token: response.data.token,
          isAdmin: true,
          user: response.data.user
        }
      }))
    }
    return response.data
  } catch (error: any) {
    console.error('Admin login error:', error.response?.data)
    throw new Error(error.response?.data?.error || 'Admin login failed')
  }
}

export const adminRegister = async (data: {
  email: string
  password: string
  name: string
  contact?: string
}) => {
  try {
    const response = await api.post('/users/admin/register', data)
    if (response.data && response.data.token) {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          token: response.data.token,
          isAdmin: true,
          user: response.data.user
        }
      }))
    }
    return response.data
  } catch (error: any) {
    console.error('Admin registration error:', error.response?.data)
    throw new Error(error.response?.data?.error || 'Admin registration failed')
  }
}

// Theater Owner
export const theaterOwnerLogin = async (data: { 
  email: string
  password: string 
}) => {
  try {
    const response = await api.post('/users/owner/login', data)
    return response.data
  } catch (error: any) {
    console.error('Theater owner login error:', error.response?.data)
    throw new Error(error.response?.data?.error || 'Login failed')
  }
}

export const theaterOwnerRegister = async (data: {
  name: string
  email: string
  password: string
  contact?: string
}) => {
  try {
    const response = await api.post('/users/owner/register', data)
    return response.data
  } catch (error: any) {
    console.error('Theater owner registration error:', error.response?.data)
    throw new Error(error.response?.data?.error || 'Registration failed')
  }
}

// Food
export const getFoodItems = () => api.get<Food[]>('/food').then(res => res.data)
export const createFoodItem = (data: Partial<Food>) => 
  api.post<Food>('/food', data).then(res => res.data)
export const updateFoodItem = (id: number, data: Partial<Food>) => 
  api.put<Food>(`/food/${id}`, data).then(res => res.data)
export const deleteFoodItem = (id: number) => 
  api.delete(`/food/${id}`).then(res => res.data)
export const addFoodToBooking = (data: any) => 
  api.post('/food/booking', data).then(res => res.data)