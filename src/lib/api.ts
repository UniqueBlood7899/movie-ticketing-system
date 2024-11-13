//src/lib/api.ts
import axios from 'axios'

const api = axios.create({
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
export const getMovies = () => api.get('/movies').then(res => res.data)
export const getMovie = (id: string) => api.get(`/movies/${id}`).then(res => res.data)

// Theaters
export const getTheaters = () => api.get('/theaters').then(res => res.data)
export const getTheater = (id: string) => api.get(`/theaters/${id}`).then(res => res.data)

// Shows
export const getShows = () => api.get('/shows').then(res => res.data)
export const getShow = (id: string) => api.get(`/shows/${id}`).then(res => res.data)

// Bookings
export const createBooking = (data: any) => api.post('/bookings', data).then(res => res.data)
export const getBookings = () => api.get('/bookings').then(res => res.data)

// Users
export const login = (data: any) => api.post('/users/login', data).then(res => res.data)
export const register = (data: any) => api.post('/users/register', data).then(res => res.data)

// Food
export const getFoodItems = () => api.get('/food').then(res => res.data)
export const addFoodToBooking = (data: any) => api.post('/food/booking', data).then(res => res.data)

// Admin
export const adminLogin = (data: any) => api.post('/users/admin/login', data).then(res => res.data)
export const adminRegister = (data: any) => api.post('/users/admin/register', data).then(res => res.data)

// Admin Movie Management
export const createMovie = (data: any) => api.post('/movies', data).then(res => res.data)
export const updateMovie = (id: number, data: any) => api.put(`/movies/${id}`, data).then(res => res.data)
export const deleteMovie = (id: number) => api.delete(`/movies/${id}`).then(res => res.data)

// Food Management
export const createFoodItem = (data: any) => api.post('/food', data).then(res => res.data)
export const updateFoodItem = (id: number, data: any) => api.put(`/food/${id}`, data).then(res => res.data)
export const deleteFoodItem = (id: number) => api.delete(`/food/${id}`).then(res => res.data)

// Theater Owner endpoints
export const theaterOwnerLogin = (data: any) => 
  api.post('/users/owner/login', data).then(res => res.data)

export const theaterOwnerRegister = (data: any) => 
  api.post('/users/owner/register', data).then(res => res.data)