//src/routes/index.tsx
import { createRootRoute, createRoute, createRouter, Link, Navigate } from '@tanstack/react-router'
import App from '../App'
import { Home } from '../pages/Home'
import { AdminHome } from '../pages/AdminHome'
import { Movies } from '../pages/Movies'
import { Theaters } from '../pages/Theaters'
import { Bookings } from '../pages/Bookings'
import { Profile } from '../pages/Profile'
import { useAuthStore } from '../stores/auth'
import { LoginForm } from '../pages/LoginForm'
import { RegisterForm } from '../pages/RegisterForm'
import { AdminMovies } from '../pages/AdminMovies'
import { AdminTheaters } from '../pages/AdminTheaters'
import { AdminShows } from '../pages/AdminShows'
import { AdminFood } from '../pages/AdminFood'
import { TheaterOwnerForm } from '../pages/TheaterOwnerForm'
import { TheaterOwnerHome } from '../pages/TheaterOwnerHome'
import { TheaterOwnerMovies } from '../pages/TheaterOwnerMovies'
import { TheaterOwnerTheaters } from '../pages/Theaters'
import { BookingForm } from '../pages/BookingForm'

// Create a root route
const rootRoute = createRootRoute({
  component: App,
})

// Create child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginForm,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterForm,
})

const moviesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/movies',
  component: Movies,
})

const theatersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/theaters',
  component: Theaters,
})

const bookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookings',
  component: Bookings,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user) {
      throw new Error('Unauthorized')
    }
  },
  errorComponent: () => (
    <Navigate to="/login" />
  ),
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
})

const adminHomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminHome,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized')
    }
  },
  errorComponent: () => (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold mb-4">Admin access required</h2>
      <Link
        to="/login"
        search={{ role: 'admin' }}
        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
      >
        Login as Admin
      </Link>
    </div>
  ),
})

const adminMoviesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/movies',
  component: AdminMovies,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized')
    }
  },
  errorComponent: () => (
    <Navigate to="/login" search={{ role: 'admin' }} />
  ),
})

const adminTheatersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/theaters', // Fixed typo from 'theatres' to 'theaters'
  component: AdminTheaters,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized')
    }
  },
  errorComponent: () => (
    <Navigate to="/login" search={{ role: 'admin' }} />
  ),
})

const adminShowsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/shows',
  component: AdminShows,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized')
    }
  },
  errorComponent: () => (
    <Navigate to="/login" search={{ role: 'admin' }} />
  ),
})

const adminFoodRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/food',
  component: AdminFood,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized')
    }
  },
  errorComponent: () => (
    <Navigate to="/login" search={{ role: 'admin' }} />
  ),
})

const theaterOwnerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/login',
  component: () => <TheaterOwnerForm type="login" />
})

const theaterOwnerRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/register', 
  component: () => <TheaterOwnerForm type="register" />
})

const theaterOwnerHomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/dashboard',
  component: TheaterOwnerHome,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user || user.role !== 'owner') {
      throw new Error('Unauthorized')
    }
  },
  errorComponent: () => (
    <Navigate to="/owner/login" />
  ),
})

const theaterOwnerMoviesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/movies',
  component: TheaterOwnerMovies,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user || user.role !== 'owner') {
      throw new Error('Unauthorized')
    }
  },
  errorComponent: () => (
    <Navigate to="/owner/login" />
  ),
})

const theaterOwnerTheatersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/theaters',
  component: TheaterOwnerTheaters,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user || user.role !== 'owner') {
      throw new Error('Unauthorized')
    }
  },
  errorComponent: () => <Navigate to="/owner/login" />
})

const bookingNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking/new',
  component: BookingForm,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      showId: String(search.showId)  // Required search param
    }
  },
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user) {
      throw new Error('Unauthorized')
    }
  },
  errorComponent: () => (
    <Navigate to="/login" />
  ),
})

// Create the route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  moviesRoute,
  theatersRoute,
  bookingsRoute,
  profileRoute,
  loginRoute,
  registerRoute,
  adminHomeRoute,
  adminMoviesRoute,
  adminTheatersRoute,
  adminShowsRoute,
  adminFoodRoute,
  theaterOwnerLoginRoute,
  theaterOwnerRegisterRoute,
  theaterOwnerHomeRoute,
  theaterOwnerMoviesRoute,
  theaterOwnerTheatersRoute,
  bookingNewRoute,
])

// Create and export the router
export const router = createRouter({ routeTree })

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}