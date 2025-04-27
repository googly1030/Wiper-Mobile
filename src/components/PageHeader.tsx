import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  userName?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ userName = 'A' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
  };
  
  const handleLogout = () => {
    // Clear user session from localStorage
    localStorage.removeItem('currentUser');
    
    // Navigate to root route
    navigate('/');
  };

  return (
    <header className="flex justify-between items-center p-4 w-full sticky top-0 bg-white z-10">
      <h1 className="text-2xl font-bold text-[#3A4B06]">Wiper</h1>
      <div className="relative" ref={dropdownRef}>
        <div 
          className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span>{userName}</span>
        </div>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 overflow-hidden">
            <div 
              className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={handleProfileClick}
            >
              Profile
            </div>
            <div className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
              Settings
            </div>
            <div className="border-t border-gray-200"></div>
            <div 
              className="py-2 px-4 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;