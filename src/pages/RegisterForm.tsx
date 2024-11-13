//src/components/RegisterForm.tsx
import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { register, adminRegister } from '../lib/api'
import { useAuthStore } from '../stores/auth'
import type { UserRole } from '../types'

export function RegisterForm() {
  const navigate = useNavigate()
  const { role = 'user' } = useSearch({ from: '/register' })
  const { setAuth } = useAuthStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const contact = formData.get('contact') as string

    try {
      if (role === 'admin') {
        const { token, user } = await adminRegister({ 
          name, email, password, contact 
        })
        setAuth(token, user, 'admin')
        navigate({ to: '/admin' })
      } else if (role === 'owner') {
        const { token, user } = await theaterOwnerRegister({
          name, email, password, contact
        })
        setAuth(token, user, 'owner')
        navigate({ to: '/owner/dashboard' })
      } else {
        const { token, user } = await register({ 
          name, email, password, phone: contact 
        })
        setAuth(token, user, 'user')
        navigate({ to: '/' })
      }
    } catch (err) {
      setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        {role === 'admin' ? 'Admin Registration' : 
         role === 'owner' ? 'Theater Owner Registration' : 'User Registration'}
      </h2>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
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
      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
          {role === 'admin' ? 'Contact' : 'Phone'}
        </label>
        <input
          type="tel"
          name="contact"
          id="contact"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}