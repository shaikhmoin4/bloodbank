// import { useState, useEffect, useRef } from 'react';
// import apiService from '../../services/api';

// const Header = ({ onToggleSidebar }) => {
//   const [user] = useState(() => {
//     const userData = localStorage.getItem('user');
//     return userData ? JSON.parse(userData) : null;
//   });

//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);




//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Branches fetch करें (सिर्फ super_admin के लिए)

//   useEffect(() => {
//     const fetchBranches = async () => {
//       if (user?.role === 'super_admin') {
//         try {
//           // यहाँ आप branches fetch कर सकते हैं API से
//           // अगर hardcoded चाहिए तो:
//           const branches = [
//             { id: 'main', name: 'Main Branch' },
//             { id: 'north', name: 'North Branch' },
//             { id: 'south', name: 'South Branch' },
//             { id: 'east', name: 'East Branch' },
//             { id: 'west', name: 'West Branch' }
//           ];
//           // Context में branches set करें
//           // setAvailableBranches(branches);
//         } catch (error) {
//           console.error('Error fetching branches:', error);
//         }
//       }
//     };
//     fetchBranches();
//   }, [user]);

//   const handleBranchChange = (event) => {
//     const branch = event.target.value;
//     setSelectedBranch(branch);

//     // यहाँ आप selected branch के according data fetch कर सकते हैं
//     // या context के through entire app में branch change propagate कर सकते हैं
//   };

//   const handleLogout = async () => {
//     try {
//       await apiService.logout();
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       // Always clear local storage and redirect
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       localStorage.removeItem('selectedBranch');
//       window.location.href = '/';
//     }
//   };

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-64 z-30">
//       <div className="flex items-center justify-between px-6 py-4">
//         {/* Left side - Breadcrumb and title */}
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={onToggleSidebar}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 md:hidden"
//           >
//             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//           <div>
//             <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
//             <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Admin'}</p>
//           </div>
//         </div>

//         {/* Right side - User menu and notifications */}
//         <div className="flex items-center space-x-4">
//           {/* Notifications */}
//           {/* <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative">
//             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM15 17H9a6 6 0 01-6-6V9a6 6 0 016-6h6m0 0l5 5m-5-5v5" />
//             </svg>
//             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//           </button> */}


//           <div className="flex items-center space-x-2">
//             <label htmlFor="branch" className="text-sm font-medium text-gray-700">
//               Branch:
//             </label>
//             <select
//               id="branch"
//               name="branch"
//               className="border border-gray-300 rounded-md px-4 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select branch</option>
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>



//           {/* User menu */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setShowDropdown(!showDropdown)}
//               className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//             >
//               <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
//                 <span className="text-white font-medium text-sm">
//                   {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
//                 </span>
//               </div>
//               <div className="hidden md:block text-left">
//                 <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin'}</p>
//                 <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
//               </div>
//               <svg className={`w-4 h-4 text-gray-500 hidden md:block transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             {/* Dropdown menu */}
//             {showDropdown && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
//                 <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
//                 <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
//                 <div className="border-t border-gray-100"></div>
//                 <button
//                   onClick={handleLogout}
//                   className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;




// import { useState, useEffect, useRef } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import apiService from '../../services/api';

// const Header = ({ onSidebarToggle }) => {
//   const [user, setUser] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const dropdownRef = useRef(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await apiService.logout();
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       localStorage.removeItem('selectedBranch');
//       window.location.href = '/';
//     }
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50 flex items-center h-16 px-4">
//       {/* Logo + Toggle */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={onSidebarToggle}
//           className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//         >
//           <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>

//         {/* You can add your logo here */}
//         <Link to='/dashboard' className="hidden md:block">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">ST</span>
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-800">Blood Flow 360</h1>
//               <p className="text-xs text-gray-500">Blood Bank</p>
//             </div>
//           </div>
//         </Link>
//       </div>

//       {/* Search bar - Optional */}
//       <div className="hidden md:flex ml-6 flex-1 max-w-md">
//         <form className="flex items-center border rounded overflow-hidden w-full">
//           <input
//             type="text"
//             placeholder="Search"
//             className="px-3 py-2 outline-none flex-1"
//           />
//         </form>
//       </div>

//       {/* Right side - User menu and branch selector */}
//       <div className="ml-auto flex items-center gap-4">
//         {/* Branch Selector */}
//         {user?.role === 'super_admin' && (
//           <div className="flex items-center space-x-2">
//             <label htmlFor="branch" className="text-sm font-medium text-gray-700 hidden md:block">
//               Branch:
//             </label>
//             <select
//               id="branch"
//               name="branch"
//               value={selectedBranch}
//               onChange={(e) => setSelectedBranch(e.target.value)}
//               className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select branch</option>
//               <option value="main">Main Branch</option>
//               <option value="north">North Branch</option>
//               <option value="south">South Branch</option>
//             </select>
//           </div>
//         )}

//         {/* User menu */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setShowDropdown(!showDropdown)}
//             className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//           >
//             <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
//               <span className="text-white font-medium text-sm">
//                 {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
//               </span>
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin'}</p>
//               <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
//             </div>
//             <svg className={`w-4 h-4 text-gray-500 hidden md:block transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>

//           {/* Dropdown menu */}
//           {showDropdown && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
//               <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
//               <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
//               <div className="border-t border-gray-100"></div>
//               <button
//                 onClick={handleLogout}
//                 className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../../services/api';

const Header = ({ onSidebarToggle }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedBranch');
      window.location.href = '/';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50 flex items-center h-16 px-4">
      {/* Logo + Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* You can add your logo here */}
        <Link to='/dashboard' className="hidden md:block">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ST</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Blood Flow 360</h1>
              <p className="text-xs text-gray-500">Blood Bank</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Search bar - Optional */}
      <div className="hidden md:flex ml-6 flex-1 max-w-md">
        <form className="flex items-center border rounded overflow-hidden w-full">
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-2 outline-none flex-1"
          />
        </form>
      </div>

      {/* Right side - User menu and branch selector */}
      <div className="ml-auto flex items-center gap-4">
        {/* Branch Selector */}
        {user?.role === 'super_admin' && (
          <div className="flex items-center space-x-2">
            <label htmlFor="branch" className="text-sm font-medium text-gray-700 hidden md:block">
              Branch:
            </label>
            <select
              id="branch"
              name="branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select branch</option>
              <option value="main">Main Branch</option>
              <option value="north">North Branch</option>
              <option value="south">South Branch</option>
            </select>
          </div>
        )}

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
            </div>
            <svg className={`w-4 h-4 text-gray-500 hidden md:block transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;