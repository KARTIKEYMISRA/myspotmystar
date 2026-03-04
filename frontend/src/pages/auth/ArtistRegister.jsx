import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

export default function ArtistRegister() {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '', city: '', category: '', bio: '', price_min: '', price_max: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const categories = ['Musician', 'Dancer', 'Singer', 'DJ', 'Comedian', 'Magician', 'Photographer', 'Makeup Artist'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/artist/register', formData);
      setAuth(response.data.artist, 'artist', response.data.accessToken);
      navigate('/artist/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-secondary">SpotMYstar</Link>
          <h2 className="text-2xl font-bold mt-4">Artist Registration</h2>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" required className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="email" placeholder="Email" required className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" placeholder="Password" required className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <input type="tel" placeholder="Phone" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <input type="text" placeholder="City" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
          <select required className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input type="number" placeholder="Min Price" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.price_min} onChange={(e) => setFormData({ ...formData, price_min: e.target.value })} />
          <input type="number" placeholder="Max Price" className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" value={formData.price_max} onChange={(e) => setFormData({ ...formData, price_max: e.target.value })} />
          <textarea placeholder="Bio" className="md:col-span-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" rows="3" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
          <button type="submit" disabled={loading} className="md:col-span-2 bg-secondary text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
            {loading ? 'Creating Account...' : 'Register as Artist'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Already registered? <Link to="/artist/login" className="text-secondary font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
