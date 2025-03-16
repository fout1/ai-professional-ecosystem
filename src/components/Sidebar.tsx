
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Brain, 
  Users, 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  LogOut,
  Bot,
  Menu,
  X,
  Briefcase,
  Sparkles,
  MessageCircle,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  
  const environmentName = localStorage.getItem('environmentName') || 'Professional';
  const environmentColor = localStorage.getItem('environmentColor') || 'from-indigo-500 to-blue-600';
  
  const handleLogout = () => {
    toast.info("Logging out...");
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
  const iconClass = "w-5 h-5";
  
  // Define sidebar options based on the menu items
  const menuItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/employees", icon: Users, label: "AI Employees" },
    { path: "/brain", icon: Brain, label: "Brain AI" },
    { path: "/calendar", icon: Calendar, label: "Calendar" },
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  ];
  
  // Animation variants
  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "72px" }
  };
  
  const textVariants = {
    expanded: { opacity: 1, display: "block" },
    collapsed: { opacity: 0, display: "none" }
  };
  
  return (
    <motion.div 
      className="h-screen bg-[#170E34]/95 backdrop-blur-sm border-r border-white/10 flex flex-col fixed left-0 top-0 z-30 overflow-hidden text-white"
      animate={expanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 bg-gradient-to-br ${environmentColor} rounded-xl flex items-center justify-center`}>
              <Bot className="w-6 h-6 text-white" />
            </div>
          </div>
          <motion.div 
            className="ml-3 truncate"
            variants={textVariants}
          >
            <p className="font-bold text-white truncate">AI {environmentName}</p>
            <p className="text-xs text-purple-300 truncate">Workspace</p>
          </motion.div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-lg hover:bg-white/10 text-purple-300"
        >
          {expanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-3 py-3 rounded-lg transition-all duration-200 group",
              location.pathname === item.path
                ? "bg-white/10 text-white"
                : "text-purple-200 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={`${iconClass} flex-shrink-0`} />
            <motion.span 
              className="ml-3 truncate"
              variants={textVariants}
            >
              {item.label}
            </motion.span>
            {!expanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded-md text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </div>
      
      {expanded && (
        <div className="p-4 mx-3 mb-4 rounded-lg bg-white/5 space-y-2">
          <h3 className="text-sm font-medium text-purple-300">Need help?</h3>
          <p className="text-xs text-purple-200">
            Access tutorials and support resources for your AI workspace
          </p>
          <button className="w-full text-sm px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/20 transition">
            View resources
          </button>
        </div>
      )}
      
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-white/10 text-purple-200 hover:text-white transition-all duration-200"
        >
          <LogOut className={iconClass} />
          <motion.span 
            className="ml-3"
            variants={textVariants}
          >
            Logout
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
