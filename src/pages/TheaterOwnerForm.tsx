// src/pages/TheaterOwnerForm.tsx
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { theaterOwnerLogin, theaterOwnerRegister } from '../lib/api'
import { useAuthStore } from '../stores/auth'

interface TheaterOwnerFormProps {
  type: 'login' | 'register'
}

export function TheaterOwnerForm({ type }: TheaterOwnerFormProps) {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      if (type === 'register') {
        const name = formData.get('name') as string
        const contact = formData.get('contact') as string
        const { token, user } = await theaterOwnerRegister({
          name,
          email,
          password,
          contact
        })
        setAuth(token, user, 'owner')
        navigate({ to: '/owner/dashboard' })
      } else {
        const { token, user } = await theaterOwnerLogin({
          email,
          password
        })
        setAuth(token, user, 'owner')
        navigate({ to: '/owner/dashboard' })
      }
    } catch (err) {
      setError(type === 'login' ? 'Invalid credentials' : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">
            Theater Owner {type === 'login' ? 'Login' : 'Registration'}
          </h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {type === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Theater Owner Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          {type === 'register' && (
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                id="contact"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading 
              ? (type === 'login' ? 'Logging in...' : 'Registering...')
              : (type === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
      </div>
    </div>
  )
}