
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Sparkles, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [environmentName, setEnvironmentName] = useState('');
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.name || parsedUser.email.split('@')[0]);
      
      // Check for environment configuration
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
      if (hasCompletedOnboarding !== 'true') {
        navigate('/onboarding');
        return;
      }
      
      // Load environment info
      const envName = localStorage.getItem('environmentName');
      if (envName) {
        setEnvironmentName(envName);
      }
      
      // Ensure company info is available
      const company = localStorage.getItem('company');
      if (!company && hasCompletedOnboarding === 'true') {
        // If company data is missing but onboarding is marked complete, we have an inconsistency
        toast.error("Missing company information. Please complete the setup again.");
        localStorage.setItem('hasCompletedOnboarding', 'false');
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error("Error loading your data. Please log in again.");
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#150D35] to-[#1D1148]">
      <Sidebar />
      <div className="flex-1 ml-[72px] lg:ml-[240px]">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#150D35]/80 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
              <h1 className="text-lg font-semibold text-white hidden sm:block">
                {environmentName ? `${environmentName} Workspace` : 'AI Professional Workspace'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#1A0D3A] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                      <h3 className="font-medium text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-3 hover:bg-white/5 border-b border-white/10">
                        <p className="text-sm text-white">Welcome to your AI Professional Workspace!</p>
                        <p className="text-xs text-purple-300 mt-1">Just now</p>
                      </div>
                      <div className="p-3 hover:bg-white/5 border-b border-white/10">
                        <p className="text-sm text-white">Your AI Employees are ready to help you</p>
                        <p className="text-xs text-purple-300 mt-1">5 minutes ago</p>
                      </div>
                      <div className="p-3 hover:bg-white/5">
                        <p className="text-sm text-white">Brain AI is ready for document uploads</p>
                        <p className="text-xs text-purple-300 mt-1">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="p-2 border-t border-white/10">
                      <button className="w-full text-xs text-center p-2 text-purple-400 hover:text-purple-300">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-purple-300">Free Plan</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
