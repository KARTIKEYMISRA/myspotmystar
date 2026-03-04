import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

export default function ArtistLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/artist/login', formData);
      setAuth(response.data.artist, 'artist', response.data.accessToken);
      navigate('/artist/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-secondary">SpotMYstar</Link>
          <h2 className="text-2xl font-bold mt-4">Artist Login</h2>
          <p className="text-gray-600 mt-2">Manage your bookings & profile</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" placeholder="Password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <button type="submit" disabled={loading} className="w-full bg-secondary text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          New artist? <Link to="/artist/register" className="text-secondary font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
