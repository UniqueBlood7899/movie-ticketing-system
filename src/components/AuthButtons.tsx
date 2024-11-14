//src/components/AuthButtons.tsx
import { LogOut } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../stores/auth'
import { AuthDropdown } from './AuthDropdown'
import { Link } from '@tanstack/react-router'

export function AuthButtons() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        {user.role === 'admin' && (
          <Link 
            to="/admin"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Admin Dashboard
          </Link>
        )}
        <button
          onClick={() => {
            logout()
            navigate({ to: '/' })
          }}
          className="flex items-center text-gray-600 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <AuthDropdown type="login" />
      <AuthDropdown type="register" />
    </div>
  )
}

export default AuthButtons