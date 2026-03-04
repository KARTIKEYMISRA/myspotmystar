import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

export default function BrandRegister() {
  const [formData, setFormData] = useState({ email: '', password: '', company_name: '', contact_person: '', phone: '', city: '', industry: '', website: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/brand/register', formData);
      setAuth(response.data.brand, 'brand', response.data.accessToken);
      navigate('/brand/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">SpotMYstar</Link>
          <h2 className="text-2xl font-bold mt-4">Brand Registration</h2>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Company Name" required className="px-4 py-2 border rounded-lg" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
          <input type="text" placeholder="Contact Person" className="px-4 py-2 border rounded-lg" value={formData.contact_person} onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} />
          <input type="email" placeholder="Email" required className="px-4 py-2 border rounded-lg" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" placeholder="Password" required className="px-4 py-2 border rounded-lg" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <input type="tel" placeholder="Phone" className="px-4 py-2 border rounded-lg" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <input type="text" placeholder="City" className="px-4 py-2 border rounded-lg" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
          <input type="text" placeholder="Industry" className="px-4 py-2 border rounded-lg" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} />
          <input type="url" placeholder="Website" className="px-4 py-2 border rounded-lg" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
          <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            {loading ? 'Creating Account...' : 'Register as Brand'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Already registered? <Link to="/brand/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
