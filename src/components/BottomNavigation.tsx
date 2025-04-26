import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type TabType = 'home' | 'plans' | 'reports';

interface BottomNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  screenWidth: number;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  screenWidth
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Update active tab based on current location
  useEffect(() => {
    if (location.pathname === '/home') {
      setActiveTab('home');
    } else if (location.pathname === '/plans') {
      setActiveTab('plans');
    } else if (location.pathname === '/reports') {
      setActiveTab('reports');
    }
  }, [location.pathname, setActiveTab]);

  // Handle tab click with navigation
  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    
    switch(tab) {
      case 'home':
        navigate('/home');
        break;
      case 'plans':
        navigate('/plans');
        break;
      case 'reports':
        navigate('/reports');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-[#F8FFDD] h-16 flex items-center justify-around z-10 shadow-md"
      style={{
        maxWidth: screenWidth > 768 ? "480px" : "100%",
        margin: "0 auto",
      }}
    >
      <button 
        className="flex flex-col items-center justify-center flex-1 py-1 relative"
        onClick={() => handleTabClick('home')}
      >
        <div 
          className={`flex flex-col items-center justify-center w-16 h-8 rounded-full absolute top-1 ${activeTab === 'home' ? 'bg-[#CAE661]' : 'bg-transparent'}`}
        >
          <img 
            src="./homeicon.png" 
            alt="Home" 
            className="w-[22px] h-[18px]"
          />
        </div>
        <span className="text-xs text-gray-700 mt-8">Home</span>
      </button>
      
      <button 
        className="flex flex-col items-center justify-center flex-1 py-1 relative"
        onClick={() => handleTabClick('plans')}
      >
        <div 
          className={`flex flex-col items-center justify-center w-16 h-8 rounded-full absolute top-1 ${activeTab === 'plans' ? 'bg-[#CAE661]' : 'bg-transparent'}`}
        >
          <img 
            src="./planicon.png" 
            alt="Plans" 
            className="w-[22px] h-[18px]"
          />
        </div>
        <span className="text-xs text-gray-700 mt-8">Plans</span>
      </button>
      
      <button 
        className="flex flex-col items-center justify-center flex-1 py-1 relative"
        onClick={() => handleTabClick('reports')}
      >
        <div 
          className={`flex flex-col items-center justify-center w-16 h-8 rounded-full absolute top-1 ${activeTab === 'reports' ? 'bg-[#CAE661]' : 'bg-transparent'}`}
        >
          <img 
            src="./reporticon.png" 
            alt="Reports" 
            className="w-[16px] h-[20px]"
          />
        </div>
        <span className="text-xs text-gray-700 mt-8">Reports</span>
      </button>
    </div>
  );
};

export default BottomNavigation;