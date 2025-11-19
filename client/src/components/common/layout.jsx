import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from '../common/Sidebar';
import Header from "../common/Header";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onSidebarToggle={handleSidebarToggle} />
      
      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* Header/Navbar */}
        <Header onSidebarToggle={handleSidebarToggle} />
        
        {/* Main Content */}
        <main className="flex-1 pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}