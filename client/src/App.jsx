import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import RolesPermissions from './pages/RolesPermissions'
import PatientHistory from './pages/PatientHistory'
import Sidebar from './components/common/Sidebar'
import Header from './components/common/Header'

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" replace />;
  };

  // Layout component for pages with sidebar and header
  const MainLayout = ({ children }) => {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64">
          <Header />
          <main className="pt-20 px-6 pb-6">
            {children}
          </main>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles-permissions"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <RolesPermissions />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-history"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PatientHistory />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          {/* Redirect unknown routes to dashboard if authenticated, otherwise to login */}
          <Route
            path="*"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
