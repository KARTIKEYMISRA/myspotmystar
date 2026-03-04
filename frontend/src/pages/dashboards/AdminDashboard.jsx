import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      {stats && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Total Users</p>
            <p className="text-3xl font-bold mt-2">{stats.total_users}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Total Artists</p>
            <p className="text-3xl font-bold mt-2">{stats.total_artists}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Total Brands</p>
            <p className="text-3xl font-bold mt-2">{stats.total_brands}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Total Bookings</p>
            <p className="text-3xl font-bold mt-2">{stats.total_bookings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Completed Bookings</p>
            <p className="text-3xl font-bold mt-2">{stats.completed_bookings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold mt-2">₹{parseFloat(stats.total_revenue).toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const toggleStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="px-6 py-4 text-sm">{user.user_id}</td>
                <td className="px-6 py-4 text-sm">{user.name}</td>
                <td className="px-6 py-4 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-sm">{user.city}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.is_active ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => toggleStatus(user.user_id)} className="text-blue-600 hover:text-blue-800">
                    {user.is_active ? 'Block' : 'Activate'}
                  </button>
                  <button onClick={() => deleteUser(user.user_id)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManageArtists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await api.get('/admin/artists');
      setArtists(response.data);
    } catch (error) {
      console.error('Failed to fetch artists', error);
    }
  };

  const toggleStatus = async (artistId) => {
    try {
      await api.put(`/admin/artists/${artistId}/toggle-status`);
      fetchArtists();
    } catch (error) {
      alert('Failed to update artist status');
    }
  };

  const verifyArtist = async (artistId) => {
    try {
      await api.put(`/admin/artists/${artistId}/verify`);
      fetchArtists();
    } catch (error) {
      alert('Failed to verify artist');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Artists</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {artists.map((artist) => (
              <tr key={artist.artist_id}>
                <td className="px-6 py-4 text-sm">{artist.artist_id}</td>
                <td className="px-6 py-4 text-sm">{artist.name} {artist.is_verified && '✓'}</td>
                <td className="px-6 py-4 text-sm">{artist.category}</td>
                <td className="px-6 py-4 text-sm">{artist.city}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${artist.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {artist.is_active ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  {!artist.is_verified && (
                    <button onClick={() => verifyArtist(artist.artist_id)} className="text-green-600 hover:text-green-800">
                      Verify
                    </button>
                  )}
                  <button onClick={() => toggleStatus(artist.artist_id)} className="text-blue-600 hover:text-blue-800">
                    {artist.is_active ? 'Block' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">SpotMYstar Admin</h1>
            <div className="flex items-center gap-6">
              <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/admin/dashboard/users" className="hover:text-gray-300">Users</Link>
              <Link to="/admin/dashboard/artists" className="hover:text-gray-300">Artists</Link>
              <Link to="/admin/dashboard/bookings" className="hover:text-gray-300">Bookings</Link>
              <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/artists" element={<ManageArtists />} />
          <Route path="/bookings" element={<div>Bookings management coming soon</div>} />
        </Routes>
      </div>
    </div>
  );
}
