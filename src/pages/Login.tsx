import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BarChart3, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login, isLoading } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const DEMO_PASSWORD = 'demo123';
  const DEMO_EXECUTIVE = 'admin@noblindspots.com';

  const quickLoginOptions = [
    { email: DEMO_EXECUTIVE, role: 'Admin' },
    { email: 'closer@noblindspots.com', role: 'Closer' },
    { email: 'dm@noblindspots.com', role: 'DM Setter' },
    { email: 'phone@noblindspots.com', role: 'Phone Setter' },
  ];

  const enterDemo = async () => {
    setError('');
    const success = await login(DEMO_EXECUTIVE, DEMO_PASSWORD);
    if (!success) {
      setError('The demo is unavailable right now. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">NoBlindSpots</h1>
          <p className="text-gray-600">The operating dashboard for GoHighLevel businesses</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 transform hover:scale-105'
              } text-white`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* One demo entry point in production. The per-role quick logins stay
              in development only — publishing a working password on a page that
              paid traffic lands on is its own kind of answer to "how do you
              handle our data?" */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={enterDemo}
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-60"
            >
              View the demo dashboard
            </button>
            <p className="mt-3 text-xs text-gray-500 text-center">
              Sample data. Nothing here is a real business.
            </p>

            {import.meta.env.DEV && (
              <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-2">
                  Dev only — sign in as a role
                </p>
                <div className="space-y-1">
                  {quickLoginOptions.map((option) => (
                    <button
                      key={option.email}
                      onClick={() => {
                        setEmail(option.email);
                        setPassword(DEMO_PASSWORD);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="font-medium">{option.role}:</span> {option.email}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            &larr; Back to noblindspots.com
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;