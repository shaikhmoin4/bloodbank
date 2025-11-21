// import './App.css'
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import RolesPermissions from './pages/RolesPermissions'
// import PatientHistory from './pages/PatientHistory'
// import Sidebar from './components/common/Sidebar'
// import Header from './components/common/Header'
// import HospitalManager from './pages/HospitalManager';
// import BloodRequest from './pages/BloodRequest';

// function App() {
//   // Check if user is authenticated
//   const isAuthenticated = () => {
//     return localStorage.getItem('token') !== null;
//   };

//   // Protected Route component
//   const ProtectedRoute = ({ children }) => {
//     return isAuthenticated() ? children : <Navigate to="/" replace />;
//   };

//   // Layout component for pages with sidebar and header
//   const MainLayout = ({ children }) => {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Sidebar />
//         <div className="ml-64">
//           <Header />
//           <main className="pt-20 px-6 pb-6">
//             {children}
//           </main>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <MainLayout>
//                   <Dashboard />
//                 </MainLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/roles-permissions"
//             element={
//               <ProtectedRoute>
//                 <MainLayout>
//                   <RolesPermissions />
//                 </MainLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/create-hospitals"
//             element={
//               <ProtectedRoute>
//                 <MainLayout>
//                   <HospitalManager />
//                 </MainLayout>
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/patient-history"
//             element={
//               <ProtectedRoute>
//                 <MainLayout>
//                   <PatientHistory />
//                 </MainLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/reception/blood-request"
//             element={
//               <ProtectedRoute>
//                 <MainLayout>
//                   <BloodRequest />
//                 </MainLayout>
//               </ProtectedRoute>
//             }
//           />
//           {/* Redirect unknown routes to dashboard if authenticated, otherwise to login */}
//           <Route
//             path="*"
//             element={
//               isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   )
// }

// export default App



// import './App.css'
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import RolesPermissions from './pages/RolesPermissions'
// import PatientHistory from './pages/PatientHistory'
// import HospitalManager from './pages/HospitalManager';
// import BloodRequest from './pages/BloodRequest';
// import Layout from './components/common/layout';

// function App() {
//   // Check if user is authenticated
//   const isAuthenticated = () => {
//     return localStorage.getItem('token') !== null;
//   };

//   // Protected Route component
//   const ProtectedRoute = ({ children }) => {
//     return isAuthenticated() ? children : <Navigate to="/" replace />;
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <Dashboard />
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/roles-permissions"
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <RolesPermissions />
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/create-hospitals"
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <HospitalManager />
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/patient-history"
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <PatientHistory />
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/reception/blood-request"
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <BloodRequest />
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//           {/* Redirect unknown routes to dashboard if authenticated, otherwise to login */}
//           <Route
//             path="*"
//             element={
//               isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   )
// }

// export default App




import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import RolesPermissions from './pages/RolesPermissions'
import BloodRequest from './pages/BloodRequest'
import HospitalManager from './pages/HospitalManager';
import BGGroupingList from './pages/BGGroupingList';
import BGGroupingView from './pages/BGGroupingView';
import BGValidation from './pages/BGvalidation';
import ABScreeningList from './pages/ABScreeningList';
import ABScreeningView from './pages/ABScreeningView';
import ABValidationList from './pages/ABValidationList';
import LabSanctionList from './pages/LabSanctionList';
import LabSanctionView from './pages/LabSanctionView';

import Layout from './components/common/layout';

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" replace />;
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
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles-permissions"
            element={
              <ProtectedRoute>
                <Layout>
                  <RolesPermissions />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-hospitals"
            element={
              <ProtectedRoute>
                <Layout>
                  <HospitalManager />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reception/blood-request"
            element={
              <ProtectedRoute>
                <Layout>
                  <BloodRequest />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/serology/bg-grouping-list"
            element={
              <ProtectedRoute>
                <Layout>
                  <BGGroupingList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/serology/bg-grouping-view/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <BGGroupingView />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/serology/bg-validation"
            element={
              <ProtectedRoute>
                <Layout>
                  <BGValidation />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/serology/ab-screening-list"
            element={
              <ProtectedRoute>
                <Layout>
                  <ABScreeningList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/serology/ab-screening/view/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ABScreeningView />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/serology/ab-validation-list"
            element={
              <ProtectedRoute>
                <Layout>
                  <ABValidationList />
                </Layout>
              </ProtectedRoute>

            }
          />
          <Route
            path="/reception/lab-sanction-list"
            element={
              <ProtectedRoute>
                <Layout>
                  <LabSanctionList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reception/lab-sanction/view/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <LabSanctionView />
                </Layout>
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