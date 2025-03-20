
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Sparkles, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { storeApiKey } from '@/config/apiConfig';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [environmentName, setEnvironmentName] = useState('');
  const [notifications, setNotifications] = useState<{text: string, time: string}[]>([]);
  
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
      
      // Set the OpenAI API key from localStorage if it exists
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        // Store the API key if it's not already set
        // Note: In production, this should be handled by a backend service
        storeApiKey('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');
        toast.success("API key has been configured");
      }
      
      // Ensure company info is available
      const company = localStorage.getItem('company');
      if (!company && hasCompletedOnboarding === 'true') {
        // If company data is missing but onboarding is marked complete, we have an inconsistency
        toast.error("Missing company information. Please complete the setup again.");
        localStorage.setItem('hasCompletedOnboarding', 'false');
        navigate('/onboarding');
      }

      // Initialize empty notifications instead of fake ones
      setNotifications([
        {
          text: `Welcome to your ${envName || 'Professional AI'} Workspace!`,
          time: 'Just now'
        }
      ]);
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
                {environmentName ? `${environmentName} Workspace` : 'Professional AI Workspace'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#1A0D3A] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                      <h3 className="font-medium text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div key={index} className="p-3 hover:bg-white/5 border-b border-white/10">
                            <p className="text-sm text-white">{notification.text}</p>
                            <p className="text-xs text-purple-300 mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-white/50">
                          <p>No notifications yet</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-2 border-t border-white/10">
                        <button 
                          className="w-full text-xs text-center p-2 text-purple-400 hover:text-purple-300"
                          onClick={() => setNotifications([])}
                        >
                          Clear all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-purple-300">Pro Plan</p>
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
