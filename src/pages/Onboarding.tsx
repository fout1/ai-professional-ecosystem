
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Users, Bot, BrainCircuit, CheckCircle2, ArrowRight, Code, HandCoins, BarChart, User } from 'lucide-react';
import { toast } from 'sonner';
import aiService from '@/services/aiService';

const steps = [
  { id: 'welcome', title: 'Welcome', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'industry', title: 'Industry', icon: <Users className="w-5 h-5" /> },
  { id: 'company', title: 'Company', icon: <BrainCircuit className="w-5 h-5" /> },
  { id: 'employees', title: 'AI Employees', icon: <Bot className="w-5 h-5" /> },
  { id: 'complete', title: 'Complete', icon: <CheckCircle2 className="w-5 h-5" /> },
];

// Business types and roles
const businessTypes = [
  { id: 'startup', name: 'Startup', icon: <Code className="w-5 h-5" /> },
  { id: 'smb', name: 'Small Business', icon: <HandCoins className="w-5 h-5" /> },
  { id: 'enterprise', name: 'Enterprise', icon: <BarChart className="w-5 h-5" /> },
  { id: 'freelancer', name: 'Freelancer', icon: <User className="w-5 h-5" /> },
];

const industries = [
  'Technology', 'E-commerce', 'Healthcare', 'Education', 
  'Finance', 'Marketing', 'Legal', 'Consulting', 
  'Real Estate', 'Manufacturing', 'Entertainment', 'Other'
];

const aiRoles = [
  { id: 'writer', name: 'Content Writer', color: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
  { id: 'researcher', name: 'Research Assistant', color: 'bg-gradient-to-br from-purple-500 to-pink-600' },
  { id: 'marketer', name: 'Marketing Specialist', color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
  { id: 'analyst', name: 'Data Analyst', color: 'bg-gradient-to-br from-emerald-500 to-green-600' },
  { id: 'assistant', name: 'Executive Assistant', color: 'bg-gradient-to-br from-rose-500 to-red-600' },
  { id: 'expert', name: 'Domain Expert', color: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [companyGoals, setCompanyGoals] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  useEffect(() => {
    // Get user info
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (userData.name) {
        setUserName(userData.name);
      } else if (userData.email) {
        setUserName(userData.email.split('@')[0]);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, [navigate]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSelectBusiness = (id: string) => {
    setSelectedBusiness(id);
  };
  
  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  const completeOnboarding = () => {
    try {
      // Save environment info - use localStorage instead of the missing method
      const environmentName = companyIndustry || 'Professional';
      localStorage.setItem('environmentName', environmentName);
      localStorage.setItem('environmentColor', 'bg-gradient-to-br from-purple-500 to-indigo-600');
      
      // Set up AI employees based on selection
      if (selectedEmployees.length > 0) {
        selectedEmployees.forEach(id => {
          const employee = aiRoles.find(role => role.id === id);
          if (employee) {
            aiService.addCustomEmployee(
              employee.name,
              employee.name,
              '/placeholder.svg',
              employee.color
            );
          }
        });
      } else {
        // Add default employees if none selected
        aiService.addCustomEmployee(
          'Research Assistant',
          'Research Assistant',
          '/placeholder.svg',
          'bg-gradient-to-br from-purple-500 to-pink-600'
        );
      }
      
      // Save company info
      localStorage.setItem('company', JSON.stringify({
        name: companyName,
        size: companySize,
        industry: companyIndustry,
        businessType: selectedBusiness,
        goals: companyGoals
      }));
      
      // Set environment for layout to use
      localStorage.setItem('environment', 'configured');
      
      // Mark onboarding as completed
      localStorage.setItem('hasCompletedOnboarding', 'true');
      
      toast.success("Your workspace is ready!");
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error("There was an error setting up your workspace");
    }
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A0118] to-[#0F0224] text-white p-4">
      <div className="w-full max-w-5xl mx-auto pt-6 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Sparkles className="text-purple-400 w-6 h-6 mr-2" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              AI Professional Setup
            </h1>
          </div>
          <div className="text-sm text-purple-300">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="flex items-center mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div 
                className={`flex flex-col items-center ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index < currentStep ? 'bg-purple-600' : 
                  index === currentStep ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 
                  'bg-gray-800'
                }`}>
                  {index < currentStep ? 
                    <CheckCircle2 className="w-5 h-5" /> : 
                    step.icon
                  }
                </div>
                <span className="text-xs">{step.title}</span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-1 ${
                  index < currentStep ? 'bg-purple-600' : 'bg-gray-800'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="bg-[#1A1031]/80 rounded-2xl p-8 backdrop-blur-lg border border-purple-500/20 shadow-2xl min-h-[400px]">
          {currentStep === 0 && (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="text-center"
            >
              <motion.div variants={item}>
                <h2 className="text-2xl font-bold mb-6">Welcome, {userName}!</h2>
                <p className="text-lg mb-8 text-purple-300">
                  Let's set up your AI professional workspace to best suit your needs. 
                  This will help us customize your experience and provide the most relevant AI assistance.
                </p>
                <p className="text-purple-300 mb-8">
                  We'll configure your workspace with the right AI tools and employees to help you achieve your goals.
                </p>
              </motion.div>
            </motion.div>
          )}
          
          {currentStep === 1 && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item}>
                <h2 className="text-2xl font-bold mb-6">Select Your Business Type</h2>
                <p className="text-purple-300 mb-8">
                  This helps us understand your needs better and provide the right AI tools.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {businessTypes.map(type => (
                    <div
                      key={type.id}
                      className={`p-4 rounded-xl border ${
                        selectedBusiness === type.id 
                          ? 'border-purple-500 bg-purple-900/30' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      } cursor-pointer transition-colors`}
                      onClick={() => handleSelectBusiness(type.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center mr-4">
                          {type.icon}
                        </div>
                        <span className="font-medium">{type.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm text-purple-300 mb-2">Select your industry</label>
                  <select 
                    className="w-full p-3 rounded-md bg-[#261945] border border-[#4B307E] text-white"
                    value={companyIndustry}
                    onChange={(e) => setCompanyIndustry(e.target.value)}
                  >
                    <option value="">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {currentStep === 2 && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item}>
                <h2 className="text-2xl font-bold mb-6">Tell Us About Your Company</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-purple-300 mb-2">Company name</label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-[#261945] border-[#4B307E]"
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-purple-300 mb-2">Company size</label>
                    <select 
                      className="w-full p-3 rounded-md bg-[#261945] border border-[#4B307E] text-white"
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                    >
                      <option value="">Select company size</option>
                      <option value="1">Just me</option>
                      <option value="2-10">2-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201+">201+ employees</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-purple-300 mb-2">What are your main goals?</label>
                    <textarea
                      className="w-full p-3 rounded-md bg-[#261945] border border-[#4B307E] text-white"
                      rows={4}
                      value={companyGoals}
                      onChange={(e) => setCompanyGoals(e.target.value)}
                      placeholder="E.g., increase sales, improve customer support, streamline operations..."
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {currentStep === 3 && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item}>
                <h2 className="text-2xl font-bold mb-6">Choose Your AI Employees</h2>
                <p className="text-purple-300 mb-8">
                  Select the AI employees that will help you achieve your goals. You can always add more later.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {aiRoles.map(role => (
                    <div
                      key={role.id}
                      className={`p-4 rounded-xl border ${
                        selectedEmployees.includes(role.id) 
                          ? 'border-purple-500 bg-purple-900/30' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      } cursor-pointer transition-colors`}
                      onClick={() => handleSelectEmployee(role.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${role.color} flex items-center justify-center mr-4`}>
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {currentStep === 4 && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="text-center"
            >
              <motion.div variants={item}>
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Setup Complete!</h2>
                <p className="text-purple-300 mb-8">
                  Your AI professional workspace is ready to go. You can now start working with your AI employees
                  and take advantage of all the features.
                </p>
                <p className="text-purple-300 mb-8">
                  Click "Get Started" to go to your dashboard and begin your journey with AI Professional.
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
        
        <div className="flex justify-between mt-8">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
              onClick={handleBack}
            >
              Back
            </Button>
          ) : (
            <div />
          )}
          
          <Button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!selectedBusiness || !companyIndustry)) ||
              (currentStep === 2 && (!companyName || !companySize))
            }
          >
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
