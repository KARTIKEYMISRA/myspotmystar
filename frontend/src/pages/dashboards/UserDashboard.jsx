import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';

function BrowseArtists() {
  const [artists, setArtists] = useState([]);
  const [filters, setFilters] = useState({ category: '', city: '', search: '' });

  useEffect(() => {
    fetchArtists();
  }, [filters]);

  const fetchArtists = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/user/artists?${params}`);
      setArtists(response.data);
    } catch (error) {
      console.error('Failed to fetch artists', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Browse Artists</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input type="text" placeholder="Search..." className="px-4 py-2 border rounded-lg" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <input type="text" placeholder="City" className="px-4 py-2 border rounded-lg" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
        <select className="px-4 py-2 border rounded-lg" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="Musician">Musician</option>
          <option value="Dancer">Dancer</option>
          <option value="Singer">Singer</option>
          <option value="DJ">DJ</option>
        </select>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <div key={artist.artist_id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">{artist.name}</h3>
              {artist.is_verified && <span className="text-blue-500">✓</span>}
            </div>
            <p className="text-gray-600">{artist.category}</p>
            <p className="text-sm text-gray-500">{artist.city}</p>
            <p className="text-sm mt-2">₹{artist.price_min} - ₹{artist.price_max}</p>
            <p className="text-yellow-500 mt-2">★ {artist.rating || 0}</p>
            <Link to={`/user/dashboard/artist/${artist.artist_id}`} className="mt-4 block text-center bg-primary text-white py-2 rounded-lg hover:bg-indigo-700">
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/user/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.booking_id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{booking.artist_name}</h3>
                <p className="text-gray-600">{booking.category}</p>
                <p className="text-sm text-gray-500 mt-2">Booking ID: {booking.booking_id}</p>
                <p className="text-sm">Date: {new Date(booking.event_date).toLocaleDateString()}</p>
                <p className="text-sm">Location: {booking.event_location}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                booking.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {booking.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UserDashboard() {
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
            <h1 className="text-xl font-bold text-primary">SpotMYstar</h1>
            <div className="flex items-center gap-6">
              <Link to="/user/dashboard" className="text-gray-700 hover:text-primary">Browse</Link>
              <Link to="/user/dashboard/bookings" className="text-gray-700 hover:text-primary">My Bookings</Link>
              <Link to="/user/dashboard/favorites" className="text-gray-700 hover:text-primary">Favorites</Link>
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
          <Route path="/" element={<BrowseArtists />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/favorites" element={<div>Favorites coming soon</div>} />
        </Routes>
      </div>
    </div>
  );
}
