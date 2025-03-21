
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [environmentName, setEnvironmentName] = useState('Professional AI');
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');

  useEffect(() => {
    // Load environment and company info if available
    const envName = localStorage.getItem('environmentName');
    if (envName) {
      setEnvironmentName(envName);
    }

    // Load company info
    const companyStr = localStorage.getItem('company');
    if (companyStr) {
      try {
        const companyData = JSON.parse(companyStr);
        setCompanyName(companyData.name || '');
        setBusinessType(companyData.businessType || '');
      } catch (error) {
        console.error('Error parsing company data:', error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For demo purposes we're simulating login
      // In a real app, this would be an API call
      
      // Store login info
      const userData = { email, name: email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      }
      
      toast.success('Login successful!');
      
      // Check if onboarding is completed
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
      
      // Navigate to dashboard or onboarding
      if (hasCompletedOnboarding === 'true') {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  // Get a personalized welcome message based on business type
  const getWelcomeMessage = () => {
    if (companyName) {
      return `Welcome back to ${companyName}`;
    }
    
    if (!businessType) return 'Sign in to your workspace';
    
    switch (businessType) {
      case 'startup':
        return 'Welcome back, innovator';
      case 'smb':
        return 'Welcome back to your business hub';
      case 'enterprise':
        return 'Access your enterprise workspace';
      case 'freelancer':
        return 'Welcome to your freelance workspace';
      default:
        return 'Sign in to your workspace';
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0A0118] to-[#0F0224] text-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="w-full max-w-md bg-[#1A1031]/80 rounded-2xl p-8 backdrop-blur-lg border border-purple-500/20 shadow-2xl"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            {getWelcomeMessage()}
          </h2>
          <p className="text-gray-400">{environmentName} Workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#261945] border-[#4B307E] pl-10 placeholder:text-gray-500"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#261945] border-[#4B307E] pl-10 placeholder:text-gray-500"
              />
              <button 
                type="button" 
                onClick={toggleShowPassword}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="data-[state=checked]:bg-purple-600 border-gray-600"
              />
              <label 
                htmlFor="remember" 
                className="text-sm text-gray-400 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link to="#" className="text-sm text-purple-400 hover:text-purple-300">
              Forgot password?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-md transition-all duration-300 shadow-lg shadow-purple-900/30"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          
          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-400 hover:text-purple-300">
              Sign up
            </Link>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
