
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!agreeTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For demo purposes we're simulating signup
      // In a real app, this would send data to a backend
      
      // Store user info in localStorage for this demo
      localStorage.setItem('user', JSON.stringify({ name, email }));
      
      toast.success('Account created successfully!');
      
      // Navigate to onboarding
      navigate('/onboarding');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
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
            Create your workspace
          </h2>
          <p className="text-gray-400">Sign up to get your professional AI environment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#261945] border-[#4B307E] pl-10 placeholder:text-gray-500"
              />
            </div>
            
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
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-500" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-[#261945] border-[#4B307E] pl-10 placeholder:text-gray-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              className="data-[state=checked]:bg-purple-600 border-gray-600"
            />
            <label 
              htmlFor="terms" 
              className="text-sm text-gray-400 cursor-pointer"
            >
              I agree to the <Link to="#" className="text-purple-400 hover:text-purple-300">Terms of Service</Link> and <Link to="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
            </label>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-md transition-all duration-300 shadow-lg shadow-purple-900/30"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
