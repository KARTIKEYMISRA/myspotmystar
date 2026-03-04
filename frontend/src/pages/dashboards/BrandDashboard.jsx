import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function BrandDashboard() {
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
            <h1 className="text-xl font-bold text-blue-600">SpotMYstar Brand</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.company_name}</span>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Brand Dashboard</h2>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Brand collaboration features coming soon!</p>
        </div>
      </div>
    </div>
  );
}
