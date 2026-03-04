import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import UserLogin from './pages/auth/UserLogin';
import ArtistLogin from './pages/auth/ArtistLogin';
import BrandLogin from './pages/auth/BrandLogin';
import AdminLogin from './pages/auth/AdminLogin';
import UserRegister from './pages/auth/UserRegister';
import ArtistRegister from './pages/auth/ArtistRegister';
import BrandRegister from './pages/auth/BrandRegister';

// Dashboards
import UserDashboard from './pages/dashboards/UserDashboard';
import ArtistDashboard from './pages/dashboards/ArtistDashboard';
import BrandDashboard from './pages/dashboards/BrandDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/artist/login" element={<ArtistLogin />} />
        <Route path="/artist/register" element={<ArtistRegister />} />
        <Route path="/brand/login" element={<BrandLogin />} />
        <Route path="/brand/register" element={<BrandRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/user/dashboard/*" 
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/artist/dashboard/*" 
          element={
            <ProtectedRoute allowedRole="artist">
              <ArtistDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/brand/dashboard/*" 
          element={
            <ProtectedRoute allowedRole="brand">
              <BrandDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard/*" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
