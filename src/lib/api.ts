//src/lib/api.ts
import axios from 'axios'
import type { Movie, Theater, Show } from '../types'

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
export const createMovie = (movieData: Partial<Movie>) => 
  api.post('/movies', movieData).then(res => res.data)
export const updateMovie = (id: number, data: Partial<Movie>) => 
  api.put(`/movies/${id}`, data).then(res => res.data)
export const deleteMovie = (id: number) => 
  api.delete(`/movies/${id}`).then(res => res.data)

// Theaters
export const getTheaters = () => api.get('/theaters').then(res => res.data)
export const getTheater = (id: string) => api.get(`/theaters/${id}`).then(res => res.data)
export const createTheater = async (data: Partial<Theater>) => {
  try {
    // Verify we have auth token
    const token = localStorage.getItem('auth-storage')
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await api.post<Theater>('/theaters', data)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Theater owner not found - Please log in again')
    }
    throw new Error(error.response?.data?.error || error.message || 'Failed to create theater')
  }
}
export const updateTheaterStatus = (id: number, status: string) => 
  api.patch(`/theaters/${id}/status`, { status }).then(res => res.data)
export const getOwnerTheaters = (ownerId: number) => 
  api.get(`/theaters/owner/${ownerId}`).then(res => res.data)

// Shows
export const getShows = () => api.get<Show[]>('/shows').then(res => res.data)
export const getShow = (id: string) => api.get<Show>(`/shows/${id}`).then(res => res.data)
export const createShow = (data: Partial<Show>) => 
  api.post<Show>('/shows', {
    movie_id: data.movie_id,
    theater_id: data.theater_id,
    show_time: data.show_time, // Should be in format: YYYY-MM-DDTHH:mm:ss
    price: data.price
  }).then(res => res.data)
export const deleteShow = (id: number) => api.delete<void>(`/shows/${id}`).then(res => res.data)

export const getTheaterShows = (theaterId: number) => 
  api.get<Show[]>(`/theaters/${theaterId}/shows`).then(res => res.data)

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
export const adminLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post('/users/admin/login', data);
    if (response.data && response.data.token) {
      // Store the admin token
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          token: response.data.token,
          isAdmin: true,
          user: response.data.user
        }
      }));
    }
    return response.data;
  } catch (error: any) {
    console.error('Admin login error:', error.response?.data);
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        'Admin login failed. Please check your credentials.';
    throw new Error(errorMessage);
  }
};

interface AdminRegistrationData {
  email: string;
  password: string;
  name: string;
  role: 'admin';
}

export const adminRegister = async (data: AdminRegistrationData) => {
  try {
    const response = await api.post('/users/admin/register', data);
    if (response.data && response.data.token) {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          token: response.data.token,
          isAdmin: true,
          user: response.data.user
        }
      }));
    }
    return response.data;
  } catch (error: any) {
    console.error('Admin registration error:', error.response?.data);
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        'Admin registration failed. Please check your input.';
    throw new Error(errorMessage);
  }
};

// Admin Theater Management
export const getAdminTheaters = () => api.get('/admin/theaters').then(res => res.data)
export const approveTheater = (id: number) => api.patch(`/theaters/${id}/status`, { status: 'approved' }).then(res => res.data)
export const rejectTheater = (id: number) => api.patch(`/theaters/${id}/status`, { status: 'rejected' }).then(res => res.data)
export const deleteTheater = (id: number) => api.delete(`/theaters/${id}`).then(res => res.data)

// Food Management
export const createFoodItem = (data: any) => api.post('/food', data).then(res => res.data)
export const updateFoodItem = (id: number, data: any) => api.put(`/food/${id}`, data).then(res => res.data)
export const deleteFoodItem = (id: number) => api.delete(`/food/${id}`).then(res => res.data)

// Theater Owner endpoints
export const theaterOwnerLogin = async (data: any) => {
  try {
    const response = await api.post('/users/owner/login', data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Login failed. Please check your credentials.');
  }
};

export const theaterOwnerRegister = (data: any) => 
  api.post('/users/owner/register', data).then(res => res.data)