import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">SpotMYstar</h1>
            </div>
            <div className="flex gap-4">
              <Link to="/user/login" className="text-gray-700 hover:text-primary">User Login</Link>
              <Link to="/artist/login" className="text-gray-700 hover:text-primary">Artist Login</Link>
              <Link to="/brand/login" className="text-gray-700 hover:text-primary">Brand Login</Link>
              <Link to="/admin/login" className="text-gray-700 hover:text-primary">Admin</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover & Book <span className="text-primary">Talented Artists</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with amazing artists for your events. From musicians to dancers, 
            photographers to DJs - find the perfect talent for your occasion.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/user/register" 
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Find Artists
            </Link>
            <Link 
              to="/artist/register" 
              className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Join as Artist
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* For Users */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold mb-4">For Users</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Browse talented artists</li>
              <li>✓ Filter by category & location</li>
              <li>✓ Read reviews & ratings</li>
              <li>✓ Easy booking process</li>
              <li>✓ Save favorite artists</li>
            </ul>
            <Link 
              to="/user/register" 
              className="mt-6 block text-center bg-indigo-100 text-primary px-6 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition"
            >
              Get Started
            </Link>
          </div>

          {/* For Artists */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold mb-4">For Artists</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Create your profile</li>
              <li>✓ Showcase your portfolio</li>
              <li>✓ Receive booking requests</li>
              <li>✓ Manage your schedule</li>
              <li>✓ Track your earnings</li>
            </ul>
            <Link 
              to="/artist/register" 
              className="mt-6 block text-center bg-indigo-100 text-primary px-6 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition"
            >
              Join Now
            </Link>
          </div>

          {/* For Brands */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold mb-4">For Brands</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Post collaborations</li>
              <li>✓ Find brand ambassadors</li>
              <li>✓ Invite artists to campaigns</li>
              <li>✓ Manage partnerships</li>
              <li>✓ Track campaign success</li>
            </ul>
            <Link 
              to="/brand/register" 
              className="mt-6 block text-center bg-indigo-100 text-primary px-6 py-2 rounded-lg font-semibold hover:bg-indigo-200 transition"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Musician', 'Dancer', 'Singer', 'DJ', 'Comedian', 'Magician', 'Photographer', 'Makeup Artist'].map((category) => (
            <div key={category} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition cursor-pointer">
              <p className="font-semibold text-gray-800">{category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 SpotMYstar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
