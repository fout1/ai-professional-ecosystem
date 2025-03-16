
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Brain, 
  Users, 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  LogOut,
  Bot
} from 'lucide-react';

const Sidebar = () => {
  const iconClass = "w-6 h-6";
  
  return (
    <div className="h-screen w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 fixed left-0 top-0">
      <div className="mb-8">
        <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <nav className="flex flex-col items-center space-y-6 flex-1">
        <Link to="/" className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <Home className={iconClass} />
        </Link>
        <Link to="/employees" className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <Users className={iconClass} />
        </Link>
        <Link to="/brain" className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <Brain className={iconClass} />
        </Link>
        <Link to="/calendar" className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <Calendar className={iconClass} />
        </Link>
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <LayoutDashboard className={iconClass} />
        </Link>
      </nav>
      
      <div className="mt-auto space-y-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <Settings className={iconClass} />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700">
          <LogOut className={iconClass} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
