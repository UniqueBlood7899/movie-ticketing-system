// src/pages/TheaterOwnerHome.tsx
import { Link, Navigate } from '@tanstack/react-router'
import { Building2, Film } from 'lucide-react'
import { useAuthStore } from '../stores/auth'

export function TheaterOwnerHome() {
  const { user } = useAuthStore()
  
  if (!user || user.role !== 'owner') {
    return <Navigate to="/owner/login" />
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Theater Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Manage your theaters and movie shows
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Building2 className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Theaters & Shows</h2>
          <p className="text-gray-600 mb-4">
            Add/manage theaters and schedule shows 
          </p>
          <Link to="/owner/theaters" className="text-indigo-600 hover:text-indigo-800">
            Manage Theaters & Shows →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Film className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Available Movies</h2>
          <p className="text-gray-600 mb-4">
            Browse available movies in the catalog
          </p>
          <Link to="/owner/movies" className="text-indigo-600 hover:text-indigo-800">
            View Movies →
          </Link>
        </div>
      </div>
    </div>
  )
}