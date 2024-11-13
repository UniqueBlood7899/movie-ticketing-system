// src/components/AuthDropdown.tsx
import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { LogIn, UserPlus, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../stores/auth'

interface AuthDropdownProps {
  type: 'login' | 'register'
}

export function AuthDropdown({ type }: AuthDropdownProps) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonText = type === 'login' ? 'Login' : 'Register'
  const Icon = type === 'login' ? LogIn : UserPlus
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-600 hover:text-indigo-600"
      >
        <Icon className="h-5 w-5 mr-2" />
        {buttonText}
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <button
              onClick={() => {
                navigate({ 
                  to: type === 'login' ? '/login' : '/register',
                  search: { role: 'user' } 
                })
                setIsOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {buttonText} as User
            </button>
            <button
              onClick={() => {
                navigate({ 
                  to: type === 'login' ? '/login' : '/register',
                  search: { role: 'admin' } 
                })
                setIsOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {buttonText} as Admin
            </button>
            <button
              onClick={() => {
                navigate({ 
                  to: `/owner/${type}` 
                })
                setIsOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {buttonText} as Theater Owner
            </button>
          </div>
        </div>
      )}
    </div>
  )
}