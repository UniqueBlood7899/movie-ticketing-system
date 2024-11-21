import { useQuery } from '@tanstack/react-query'
import { getBookingLogs } from '../lib/api'

interface BookingLog {
  id: number
  booking_id: number
  action: string
  new_data: Record<string, any>
  changed_at: string
}

export function AdminBookingLogs() {
  const { data: logs, isLoading, error } = useQuery<BookingLog[]>({
    queryKey: ['bookingLogs'],
    queryFn: getBookingLogs,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Error loading booking logs: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Booking Logs</h1>
      <div className="space-y-6">
        {logs?.map((log: BookingLog) => (
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