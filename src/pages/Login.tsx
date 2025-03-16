
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { storeApiKey } from '@/config/apiConfig';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For demo purposes we're simulating login
      // In a real app, this would validate with a backend
      if (email && password) {
        // Store the API key securely
        if (apiKey) {
          storeApiKey(apiKey);
        }
        
        // Store user info in localStorage for this demo
        localStorage.setItem('user', JSON.stringify({ email }));
        
        // Check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
        
        toast.success('Login successful!');
        
        // Navigate to onboarding if not completed, otherwise to dashboard
        if (hasCompletedOnboarding === 'true') {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } else {
        toast.error('Please enter both email and password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">Sign in to your professional AI workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="OpenAI API Key (optional)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
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
