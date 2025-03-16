
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Gavel, Calculator, Building2, Hammer, Sparkles, Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import aiService, { EnvironmentType } from '@/services/aiService';

interface EnvironmentOption {
  id: string;
  title: string;
  type: EnvironmentType;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradientClass: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [environmentName, setEnvironmentName] = useState('');
  
  const environments: EnvironmentOption[] = [
    {
      id: 'law',
      title: 'Law Firm',
      type: 'law',
      description: 'AI employees for legal research, contract drafting, and document analysis',
      icon: <Gavel className="w-6 h-6 text-blue-500" />,
      color: 'text-blue-500',
      gradientClass: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    },
    {
      id: 'accounting',
      title: 'Accounting Firm',
      type: 'accounting',
      description: 'AI employees for accounting, tax calculations, and invoice management',
      icon: <Calculator className="w-6 h-6 text-green-500" />,
      color: 'text-green-500',
      gradientClass: 'bg-gradient-to-br from-green-500 to-emerald-600',
    },
    {
      id: 'architecture',
      title: 'Architecture Studio',
      type: 'architecture',
      description: 'AI employees for rendering, design assistance, and project management',
      icon: <Building2 className="w-6 h-6 text-pink-500" />,
      color: 'text-pink-500',
      gradientClass: 'bg-gradient-to-br from-pink-500 to-rose-600',
    },
    {
      id: 'engineering',
      title: 'Engineering Firm',
      type: 'engineering',
      description: 'AI employees for simulations, calculations, and project reporting',
      icon: <Hammer className="w-6 h-6 text-amber-500" />,
      color: 'text-amber-500',
      gradientClass: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
  ];
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Check if user has already completed onboarding
    const env = aiService.getEnvironmentInfo();
    if (env.name && env.type !== 'custom') {
      // User has already set up their environment
      navigate('/');
    }
  }, [navigate]);
  
  const handleEnvironmentSelect = (id: string) => {
    setSelectedEnvironment(id);
    
    // Set default name based on selection
    const selectedEnv = environments.find(env => env.id === id);
    if (selectedEnv) {
      setEnvironmentName(`My ${selectedEnv.title}`);
    }
  };
  
  const handleContinue = () => {
    if (!selectedEnvironment) {
      toast.error('Please select an environment type');
      return;
    }
    
    setCurrentStep(2);
  };
  
  const handleSetupComplete = () => {
    if (!environmentName.trim()) {
      toast.error('Please enter a name for your environment');
      return;
    }
    
    const selectedEnv = environments.find(env => env.id === selectedEnvironment);
    if (!selectedEnv) {
      toast.error('Please select a valid environment');
      return;
    }
    
    // Set up the environment in our service
    aiService.setEnvironment(
      environmentName,
      selectedEnv.gradientClass,
      selectedEnv.type
    );
    
    toast.success('Your AI workspace is ready!');
    
    // Navigate to dashboard
    navigate('/');
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0A051E] to-[#120A2F]">
      <div className="max-w-4xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold text-white mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Welcome to your AI Professional workspace
          </motion.h1>
          <motion.p 
            className="text-purple-300"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Let's set up your environment with specialized AI employees for your profession
          </motion.p>
        </div>
        
        <motion.div 
          className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6 flex items-center">
            <div className={`w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-purple-600' : 'bg-white/10'} flex items-center justify-center`}>
              {currentStep > 1 ? <Check className="w-5 h-5 text-white" /> : <span className="text-white font-medium">1</span>}
            </div>
            <div className="h-0.5 w-12 bg-white/10 mx-2"></div>
            <div className={`w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-purple-600' : 'bg-white/10'} flex items-center justify-center`}>
              {currentStep > 2 ? <Check className="w-5 h-5 text-white" /> : <span className="text-white font-medium">2</span>}
            </div>
          </div>
          
          {currentStep === 1 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Choose your environment</h2>
              <p className="text-purple-300 mb-6">Select the type of professional environment you want to create</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {environments.map((env) => (
                  <motion.div
                    key={env.id}
                    variants={itemVariants}
                    onClick={() => handleEnvironmentSelect(env.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedEnvironment === env.id 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-lg ${env.gradientClass} flex items-center justify-center mr-3`}>
                        {env.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{env.title}</h3>
                        <p className="text-sm text-purple-300">{env.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleContinue}
                >
                  Continue
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {currentStep === 2 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Customize your workspace</h2>
              <p className="text-purple-300 mb-6">Give your AI environment a name</p>
              
              <div className="mb-6">
                <label htmlFor="environmentName" className="block text-sm font-medium text-purple-300 mb-2">
                  Environment Name
                </label>
                <input
                  type="text"
                  id="environmentName"
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="My Law Firm"
                  value={environmentName}
                  onChange={(e) => setEnvironmentName(e.target.value)}
                />
              </div>
              
              {selectedEnvironment && (
                <motion.div 
                  className="mb-8 p-4 rounded-lg border border-white/10 bg-white/5"
                  variants={itemVariants}
                >
                  <h3 className="font-medium text-white mb-2">Your AI Employees</h3>
                  <p className="text-sm text-purple-300 mb-4">
                    Based on your selection, your workspace will include these specialized AI employees:
                  </p>
                  
                  <div className="space-y-3">
                    {selectedEnvironment === 'law' && (
                      <>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                          <span className="text-white">Legal Research Assistant</span>
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="text-white">Contract Drafter</span>
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
                          <span className="text-white">Document Analyzer</span>
                        </div>
                      </>
                    )}
                    
                    {selectedEnvironment === 'accounting' && (
                      <>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-white">Accountant</span>
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-emerald-400 mr-2" />
                          <span className="text-white">Tax Specialist</span>
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-teal-400 mr-2" />
                          <span className="text-white">Invoice Manager</span>
                        </div>
                      </>
                    )}
                    
                    {selectedEnvironment === 'architecture' && (
                      <>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-pink-400 mr-2" />
                          <span className="text-white">Rendering Expert</span>
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-rose-400 mr-2" />
                          <span className="text-white">Design Assistant</span>
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-red-400 mr-2" />
                          <span className="text-white">Project Manager</span>
                        </div>
                      </>
                    )}
                    
                    {selectedEnvironment === 'engineering' && (
                      <>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-amber-400 mr-2" />
                          <span className="text-white">Simulation Expert</span>
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-orange-400 mr-2" />
                          <span className="text-white">Structural Engineer</span>
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                          <span className="text-white">Project Reporter</span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="border-white/10 text-white"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleSetupComplete}
                >
                  Complete Setup
                  <Sparkles className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
