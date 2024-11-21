import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [userEmail, setUserEmail] = useState('');
  const [bookingLogs, setBookingLogs] = useState([]);

  const fetchUserBookings = async () => {
    try {
      const response = await axios.get(`/api/admin/user-bookings/${userEmail}`);
      setBookingLogs(response.data);
    } catch (error) {
      console.error('Error fetching booking logs:', error);
      alert('Error fetching booking logs');
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* ...existing dashboard content... */}
      
      <div className="booking-logs-section">
        <h2>View User Booking Logs</h2>
        <div className="search-user">
          <input
            type="email"
            placeholder="Enter User Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <button onClick={fetchUserBookings}>View Bookings</button>
        </div>

        {bookingLogs.length > 0 && (
          <table className="booking-logs-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User Name</th>
                <th>Movie</th>
                <th>Theater</th>
                <th>Show Time</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {bookingLogs.map((log) => (
                <tr key={log.booking_id}>
                  <td>{log.booking_id}</td>
                  <td>{log.user_name}</td>
                  <td>{log.movie_title}</td>
                  <td>{log.theater_name}</td>
                  <td>{new Date(log.show_time).toLocaleString()}</td>
                  <td>{JSON.stringify(log.seats)}</td>
                  <td>${log.total_amount}</td>
                  <td>{new Date(log.booking_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;