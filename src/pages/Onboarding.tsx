
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scale, Landmark, Building2, Ruler, Briefcase, Cpu, PenTool, Calculator, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface EnvironmentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  aiEmployees: number;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const environments: EnvironmentOption[] = [
    {
      id: 'law-firm',
      name: 'Law Firm',
      description: 'Legal research, contract drafting, document analysis, and consultations',
      icon: <Scale className="w-6 h-6" />,
      color: 'from-indigo-500 to-blue-600',
      aiEmployees: 4,
    },
    {
      id: 'accounting-firm',
      name: 'Accounting Firm',
      description: 'Accounting, invoice management, balance sheets, and tax calculations',
      icon: <Calculator className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600',
      aiEmployees: 3,
    },
    {
      id: 'architecture-studio',
      name: 'Architecture Studio',
      description: 'Rendering, assisted design, client management, and deadline tracking',
      icon: <PenTool className="w-6 h-6" />,
      color: 'from-violet-600 to-purple-700',
      aiEmployees: 4,
    },
    {
      id: 'engineering-firm',
      name: 'Engineering Firm',
      description: 'Simulations, structural calculations, project management, and reporting',
      icon: <Cpu className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600',
      aiEmployees: 3,
    },
    {
      id: 'consulting-firm',
      name: 'Consulting Firm',
      description: 'Market research, strategy planning, data analysis, and presentation development',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600',
      aiEmployees: 4,
    },
    {
      id: 'real-estate-agency',
      name: 'Real Estate Agency',
      description: 'Property management, client database, market analysis, and listing automation',
      icon: <Building2 className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      aiEmployees: 3,
    },
  ];

  const aiEmployeesByEnvironment = {
    'law-firm': [
      { id: '1', name: 'Lenny', role: 'Legal Research', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-indigo-500 to-blue-600' },
      { id: '2', name: 'Claire', role: 'Contract Drafter', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-indigo-400 to-blue-500' },
      { id: '3', name: 'Alex', role: 'Document Analyzer', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-indigo-600 to-blue-700' },
      { id: '4', name: 'Jess', role: 'Client Consultant', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-indigo-300 to-blue-400' },
    ],
    'accounting-firm': [
      { id: '1', name: 'Adam', role: 'Accountant', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
      { id: '2', name: 'Finley', role: 'Tax Specialist', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
      { id: '3', name: 'Morgan', role: 'Invoice Manager', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-blue-600 to-cyan-700' },
    ],
    'architecture-studio': [
      { id: '1', name: 'Ava', role: 'Rendering Expert', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-gradient-to-br from-violet-600 to-purple-700' },
      { id: '2', name: 'Devin', role: 'Design Assistant', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-gradient-to-br from-violet-500 to-purple-600' },
      { id: '3', name: 'Sam', role: 'Project Manager', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-gradient-to-br from-violet-700 to-purple-800' },
      { id: '4', name: 'Riley', role: 'Client Coordinator', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-gradient-to-br from-violet-400 to-purple-500' },
    ],
    'engineering-firm': [
      { id: '1', name: 'Erica', role: 'Simulation Expert', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-gradient-to-br from-pink-500 to-rose-600' },
      { id: '2', name: 'Calvin', role: 'Structural Engineer', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-gradient-to-br from-pink-400 to-rose-500' },
      { id: '3', name: 'Taylor', role: 'Project Reporter', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-gradient-to-br from-pink-600 to-rose-700' },
    ],
    'consulting-firm': [
      { id: '1', name: 'Marcus', role: 'Market Researcher', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
      { id: '2', name: 'Sophia', role: 'Strategy Expert', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-amber-400 to-orange-500' },
      { id: '3', name: 'Lucas', role: 'Data Analyst', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-amber-600 to-orange-700' },
      { id: '4', name: 'Emma', role: 'Presentation Designer', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-amber-300 to-orange-400' },
    ],
    'real-estate-agency': [
      { id: '1', name: 'Noah', role: 'Property Manager', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
      { id: '2', name: 'Olivia', role: 'Client Specialist', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
      { id: '3', name: 'Ethan', role: 'Market Analyst', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-gradient-to-br from-emerald-600 to-teal-700' },
    ],
  };

  const handleContinue = async () => {
    if (!selectedEnvironment) {
      toast.error('Please select an environment to continue');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find the selected environment details
      const environment = environments.find(env => env.id === selectedEnvironment);
      
      // Store environment selection
      localStorage.setItem('environment', selectedEnvironment);
      localStorage.setItem('environmentName', environment?.name || '');
      localStorage.setItem('environmentColor', environment?.color || '');
      
      // Store AI employees for this environment
      localStorage.setItem('aiEmployees', JSON.stringify(aiEmployeesByEnvironment[selectedEnvironment as keyof typeof aiEmployeesByEnvironment]));
      
      toast.success(`${environment?.name} environment setup successful!`);
      navigate('/');
    } catch (error) {
      toast.error('Failed to set up environment. Please try again.');
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2A0E61] to-[#23174C] p-6 overflow-x-hidden">
      <motion.div 
        className="w-full max-w-5xl space-y-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            Choose Your Professional Environment
          </h1>
          <p className="mt-3 text-lg text-purple-300">
            Select the work environment that matches your profession to get started with specialized AI employees
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {environments.map((env) => (
            <motion.div
              key={env.id}
              variants={item}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card 
                className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white ${
                  selectedEnvironment === env.id 
                    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#23174C]' 
                    : 'hover:border-purple-500/50'
                }`}
                onClick={() => setSelectedEnvironment(env.id)}
              >
                <div className="flex items-start">
                  <div className={`bg-gradient-to-br ${env.color} p-3 rounded-lg text-white mr-4`}>
                    {env.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{env.name}</h3>
                    <p className="text-purple-300 text-sm mt-1">{env.description}</p>
                    <div className="flex items-center mt-3 text-xs text-purple-400">
                      <span className="bg-purple-500/20 rounded-full px-2 py-1">{env.aiEmployees} AI Employees</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="flex justify-end mt-12">
          <Button 
            onClick={handleContinue}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 group"
            disabled={!selectedEnvironment || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Setting up your workspace...</span>
              </div>
            ) : (
              <>
                <span>Continue to Workspace</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
