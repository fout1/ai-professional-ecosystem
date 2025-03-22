import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Sparkles, Bell, User, Menu as MenuIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { storeApiKey } from '@/config/apiConfig';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [userName, setUserName] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [environmentName, setEnvironmentName] = useState('');
  const [notifications, setNotifications] = useState<{text: string, time: string}[]>([]);
  const [businessType, setBusinessType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [userPlan, setUserPlan] = useState('Pro Plan');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.name || parsedUser.email.split('@')[0]);
      
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
      if (hasCompletedOnboarding !== 'true') {
        navigate('/onboarding');
        return;
      }
      
      const company = localStorage.getItem('company');
      if (company) {
        const companyData = JSON.parse(company);
        setCompanyName(companyData.name || '');
        setBusinessType(companyData.businessType || '');
        setCompanySize(companyData.size || '');
        
        if (companyData.size) {
          if (companyData.size === '201+') {
            setUserPlan('Enterprise Plan');
          } else if (companyData.size === '51-200') {
            setUserPlan('Business Plan');
          } else if (companyData.size === '11-50') {
            setUserPlan('Team Plan');
          }
        }
      }
      
      const envName = localStorage.getItem('environmentName');
      if (envName) {
        setEnvironmentName(envName);
      }
      
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        storeApiKey('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');
        toast.success("API key has been configured");
      }
      
      if (!company && hasCompletedOnboarding === 'true') {
        toast.error("Missing company information. Please complete the setup again.");
        localStorage.setItem('hasCompletedOnboarding', 'false');
        navigate('/onboarding');
      }

      const welcomeMessage = getPersonalizedWelcomeMessage(companyName, businessType, environmentName);
      
      setNotifications([
        {
          text: welcomeMessage,
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

  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [navigate, isMobile]);

  const getPersonalizedWelcomeMessage = (companyName: string, businessType: string, envName: string) => {
    if (companyName) {
      return `Welcome to your ${companyName} AI Workspace!`;
    }
    
    if (businessType) {
      switch (businessType) {
        case 'startup':
          return `Welcome to your Startup Growth AI Workspace!`;
        case 'smb':
          return `Welcome to your Small Business AI Workspace!`;
        case 'enterprise':
          return `Welcome to your Enterprise AI Workspace!`;
        case 'freelancer':
          return `Welcome to your Freelance AI Workspace!`;
        default:
          return `Welcome to your ${envName || 'Professional AI'} Workspace!`;
      }
    }
    
    return `Welcome to your ${envName || 'Professional AI'} Workspace!`;
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#150D35] to-[#1D1148]">
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-smooth"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <div className={cn(
        "transition-smooth responsive-sidebar",
        isMobile ? (mobileMenuOpen ? "translate-x-0" : "-translate-x-full") : "ml-0"
      )}>
        <Sidebar mobileMenuOpen={mobileMenuOpen} />
      </div>
      
      <div className={cn(
        "flex-1 transition-smooth",
        isMobile ? "ml-0" : "ml-[72px] lg:ml-[240px]"
      )}>
        <header className="sticky top-0 z-20 bg-[#150D35]/80 backdrop-blur-sm border-b border-white/10 mobile-padding">
          <div className="flex items-center justify-between">
            {isMobile && (
              <button 
                onClick={toggleMobileMenu}
                className="p-2 mr-2 rounded-full bg-white/5 hover:bg-white/10 text-purple-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            )}
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
              <h1 className="text-lg font-semibold text-white hidden sm:block">
                {companyName ? `${companyName}` : environmentName ? `${environmentName} Workspace` : 'Professional AI Workspace'}
              </h1>
              <h1 className="text-base font-semibold text-white sm:hidden">
                {companyName ? companyName.substring(0, 12) + (companyName.length > 12 ? '...' : '') : 'AI Workspace'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
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
                  <div className="absolute right-0 mt-2 w-[280px] sm:w-80 bg-[#1A0D3A] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                      <h3 className="font-medium text-white mobile-text">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto hide-scrollbar">
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
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-purple-300">{userPlan}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="mobile-padding">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
