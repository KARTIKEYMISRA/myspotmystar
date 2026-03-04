import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';

function BookingRequests() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/artist/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    }
  };

  const handleAccept = async (bookingId) => {
    const price = prompt('Enter price for this booking:');
    if (!price) return;
    try {
      await api.put(`/artist/bookings/${bookingId}/accept`, { price });
      fetchBookings();
    } catch (error) {
      alert('Failed to accept booking');
    }
  };

  const handleReject = async (bookingId) => {
    if (!confirm('Are you sure you want to reject this booking?')) return;
    try {
      await api.put(`/artist/bookings/${bookingId}/reject`);
      fetchBookings();
    } catch (error) {
      alert('Failed to reject booking');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Booking Requests</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.booking_id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{booking.user_name}</h3>
                <p className="text-sm text-gray-500 mt-2">Booking ID: {booking.booking_id}</p>
                <p className="text-sm">Date: {new Date(booking.event_date).toLocaleDateString()}</p>
                <p className="text-sm">Location: {booking.event_location}</p>
                <p className="text-sm">Event Type: {booking.event_type}</p>
                <p className="text-sm mt-2">Message: {booking.message}</p>
                <p className="text-sm">Contact: {booking.user_phone}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-sm text-center ${
                  booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  booking.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
                {booking.status === 'requested' && (
                  <>
                    <button onClick={() => handleAccept(booking.booking_id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                      Accept
                    </button>
                    <button onClick={() => handleReject(booking.booking_id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Earnings() {
  const [earnings, setEarnings] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await api.get('/artist/earnings');
      setEarnings(response.data);
    } catch (error) {
      console.error('Failed to fetch earnings', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Earnings Dashboard</h2>
      {earnings && (
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Total Bookings</p>
            <p className="text-3xl font-bold mt-2">{earnings.total_bookings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Completed</p>
            <p className="text-3xl font-bold mt-2">{earnings.completed_bookings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Total Earnings</p>
            <p className="text-3xl font-bold mt-2">₹{parseFloat(earnings.total_earnings).toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Avg Booking</p>
            <p className="text-3xl font-bold mt-2">₹{parseFloat(earnings.avg_booking_price).toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArtistDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-secondary">SpotMYstar Artist</h1>
            <div className="flex items-center gap-6">
              <Link to="/artist/dashboard" className="text-gray-700 hover:text-secondary">Bookings</Link>
              <Link to="/artist/dashboard/earnings" className="text-gray-700 hover:text-secondary">Earnings</Link>
              <Link to="/artist/dashboard/profile" className="text-gray-700 hover:text-secondary">Profile</Link>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user?.name}</span>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<BookingRequests />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/profile" element={<div>Profile editing coming soon</div>} />
        </Routes>
      </div>
    </div>
  );
}
