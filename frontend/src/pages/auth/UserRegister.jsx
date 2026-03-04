import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

export default function UserRegister() {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/user/register', formData);
      setAuth(response.data.user, 'user', response.data.accessToken);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">SpotMYstar</Link>
          <h2 className="text-2xl font-bold mt-4">User Registration</h2>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" placeholder="Password (min 6 characters)" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <input type="tel" placeholder="Phone" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <input type="text" placeholder="City" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/user/login" className="text-primary font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
