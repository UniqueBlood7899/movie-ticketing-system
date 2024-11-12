import { useState } from 'react'
import { useAuthStore } from '../stores/auth'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { User, Mail, Phone } from 'lucide-react'

export function Profile() {
  const { user } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)

  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`text-lg font-semibold ${
                isLogin ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`text-lg font-semibold ${
                !isLogin ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              Register
            </button>
          </div>
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="space-y-6">
          <div className="flex items-center">
            <User className="h-6 w-6 text-gray-400 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Mail className="h-6 w-6 text-gray-400 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Phone className="h-6 w-6 text-gray-400 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-lg">{user.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}