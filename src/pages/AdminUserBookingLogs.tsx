//src/pages/AdminUserBookingLogs.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

interface BookingLog {
  id: number
  booking_id: number
  action: string
  new_data: Record<string, any>
  changed_at: string
}

export function AdminUserBookingLogs() {
  const [userId, setUserId] = useState('')

  const { data: logs, isLoading, error } = useQuery<BookingLog[]>({
    queryKey: ['userBookingLogs', userId],
    queryFn: async () => {
      if (!userId) return []
      const response = await api.get(`/booking-logs/user/${userId}`)
      return response.data
    },
    enabled: !!userId
  })

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">User Booking Logs</h1>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          User ID
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border rounded-md"
          placeholder="Enter user ID"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      )}

      {error && (
        <div className="text-red-600">
          Error loading logs: {error.message}
        </div>
      )}

      <div className="space-y-6">
        {logs?.map((log) => (
          <div key={log.id} className="bg-white rounded-lg shadow-md p-6">
            <p><strong>Action:</strong> {log.action}</p>
            <p><strong>Changed At:</strong> {new Date(log.changed_at).toLocaleString()}</p>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(log.new_data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}