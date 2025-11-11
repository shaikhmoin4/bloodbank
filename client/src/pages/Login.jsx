import { useState, useEffect } from 'react';
import apiService from '../services/api';
import bloodSvg from '../assets/blood-research-amico.svg';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.login(formData);

      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setSuccess('Login successful! Redirecting...');

        setTimeout(() => {
          window.location.href = '/dashboard'; 
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Blood Animation Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Blood drop animations - FIXED ROTATION */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute z-0"
            style={{
              top: `${-10 + Math.random() * 20}%`,
              left: `${Math.random() * 100}%`,
              animation: `bloodDrop ${6 + Math.random() * 8}s ease-in infinite ${Math.random() * 3}s`,
            }}
          >
            <div className={`blood-drop ${i % 3 === 0 ? 'large' : i % 2 === 0 ? 'medium' : 'small'}`}></div>
          </div>
        ))}
        
        {/* Blood stream animations */}
        <div className="absolute top-0 left-1/4 w-1 h-20 bg-gradient-to-b from-transparent via-red-400 to-red-600 opacity-40 animate-bloodStream z-0"></div>
        <div className="absolute top-10 right-1/3 w-1 h-16 bg-gradient-to-b from-transparent via-red-500 to-red-700 opacity-50 animate-bloodStream delay-1000 z-0"></div>
        <div className="absolute bottom-20 left-1/3 w-1 h-24 bg-gradient-to-b from-transparent via-red-300 to-red-500 opacity-30 animate-bloodStream delay-2000 z-0"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-20 bg-gradient-to-b from-transparent via-red-400 to-red-600 opacity-40 animate-bloodStream delay-1500 z-0"></div>
        
        {/* Floating blood cells */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br from-red-400 to-red-600 opacity-25 z-0 ${
              i % 2 === 0 ? 'w-10 h-10' : 'w-6 h-6'
            }`}
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animation: `bloodCellFloat ${15 + Math.random() * 10}s ease-in-out infinite ${Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Pulsing circles */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 z-0">
          <div className="w-32 h-32 bg-red-200 rounded-full opacity-20 animate-pulse-slow"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 z-0">
          <div className="w-24 h-24 bg-rose-300 rounded-full opacity-25 animate-ping-slow"></div>
        </div>
      </div>

      {/* Left side: SVG Illustration - No background, no shadow */}
      <div className={`w-full md:w-6/10 flex items-center justify-center p-4 relative overflow-hidden transition-all duration-1000 ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'} z-10`}>
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={bloodSvg}
            alt="Blood Research Illustration"
            className="w-full h-auto max-w-2xl object-contain transform transition-all duration-500 hover:scale-105 z-20"
            style={{ minHeight: '500px' }}
          />
        </div>
      </div>

      {/* Right side: Login Form - No shadow, no border, clean background */}
      <div className={`w-full md:w-4/10 flex items-center justify-center p-8 relative transition-all duration-1000 delay-300 ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} z-10`}>
        <div className="max-w-sm w-full space-y-8 relative z-20">
          <div>
            <div className="mx-auto flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <img
                src="/src/assets/bloodflow360.png"
                alt="Blood Flow 360 Logo"
                className="h-32 w-auto object-contain"
              />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-red-500 to-red-500 bg-clip-text text-transparent">
              Blood Flow 360
            </h2>
            <p className="mt-2 text-center text-sm text-red-600 font-medium">
              🩸 Secure login to your blood bank management system
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 sm:text-sm bg-white/80"
                    placeholder="Enter your username or email"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 sm:text-sm bg-white/80"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{success}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign in to Dashboard
                  </div>
                )}
              </button>
            </div>

            <div className="text-center">
              <div className="mt-6 pt-6">
                <p className="text-base text-red-500 font-medium">
                  🩸 Blood Flow 360 Blood Bank Management System
                </p>
                <p className="text-sm text-red-400 mt-1">
                  Authorized personnel only • Version 1.0.0
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Add custom styles for blood animations - FIXED ROTATION */}
<style jsx>{`
  @keyframes bloodDrop {
    0% {
      transform: translateY(-150px) rotateZ(0deg) scale(0.5);
      opacity: 0;
    }
    15% {
      opacity: 0.8;
      transform: translateY(0) rotateZ(0deg) scale(1);
    }
    85% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(120vh) rotateZ(0deg) scale(0.8);
      opacity: 0;
    }
  }

  .blood-drop {
    background: 
      radial-gradient(circle at 30% 30%, #ef4444, #dc2626 70%);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    position: relative;
    filter: drop-shadow(1px 2px 2px rgba(220, 38, 38, 0.3));
  }

  .blood-drop::after {
    content: '';
    position: absolute;
    top: 20%;
    left: 25%;
    width: 15%;
    height: 15%;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transform: rotate(10deg);
  }

  .blood-drop.large {
    width: 18px;
    height: 24px;
  }

  .blood-drop.medium {
    width: 13px;
    height: 18px;
  }

  .blood-drop.small {
    width: 8px;
    height: 12px;
  }
`}</style>
    </div>
  );
};

export default Login;