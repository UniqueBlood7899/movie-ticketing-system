//src/types/index.ts
export interface User {
  id: number
  name: string
  email: string
  phone?: string
}

export interface Admin {
  id: number
  name: string
  email: string
  contact?: string
}

export interface TheaterOwner {
  id: number
  name: string
  email: string
  contact?: string
}

export interface Movie {
  id: number
  title: string
  duration: number
  genre: string
  description: string
  image_url: string
  release_date: string
  admin_id: number
}

export interface Theater {
  id: number
  name: string
  location: string
  capacity: number
  owner_id: number
}

export interface Show {
  id: number
  movie_id: number
  theater_id: number
  show_date: string
  show_time: string
  price: number
  movie: Movie
  theater: Theater
}

export interface Booking {
  id: number
  user_id: number
  show_id: number
  booking_date: string
  seats: string
  total_amount: number
  show: Show
}

export interface Food {
  id: number
  name: string
  price: number
}

export interface AuthState {
  token: string | null
  user: User | Admin | TheaterOwner | null
  role: UserRole | null
}

export type UserRole = 'user' | 'admin' | 'owner';