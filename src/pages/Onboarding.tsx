
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scale, Landmark, Building2, Ruler } from 'lucide-react';
import { toast } from 'sonner';

interface EnvironmentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
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
      color: 'bg-brand-blue',
    },
    {
      id: 'accounting-firm',
      name: 'Accounting Firm',
      description: 'Accounting, invoice management, balance sheets, and tax calculations',
      icon: <Landmark className="w-6 h-6" />,
      color: 'bg-brand-orange',
    },
    {
      id: 'architecture-studio',
      name: 'Architecture Studio',
      description: 'Rendering, assisted design, client management, and deadline tracking',
      icon: <Building2 className="w-6 h-6" />,
      color: 'bg-brand-purple',
    },
    {
      id: 'engineering-firm',
      name: 'Engineering Firm',
      description: 'Simulations, structural calculations, project management, and reporting',
      icon: <Ruler className="w-6 h-6" />,
      color: 'bg-emerald-500',
    },
  ];

  const aiEmployeesByEnvironment = {
    'law-firm': [
      { id: '1', name: 'Lenny', role: 'Legal Research', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-brand-blue' },
      { id: '2', name: 'Claire', role: 'Contract Drafter', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-blue-500' },
      { id: '3', name: 'Alex', role: 'Document Analyzer', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-brand-purple' },
    ],
    'accounting-firm': [
      { id: '1', name: 'Adam', role: 'Accountant', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-brand-orange' },
      { id: '2', name: 'Finley', role: 'Tax Specialist', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-amber-500' },
      { id: '3', name: 'Morgan', role: 'Invoice Manager', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-yellow-500' },
    ],
    'architecture-studio': [
      { id: '1', name: 'Ava', role: 'Rendering Expert', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-brand-purple' },
      { id: '2', name: 'Devin', role: 'Design Assistant', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-brand-blue' },
      { id: '3', name: 'Sam', role: 'Project Manager', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-emerald-500' },
    ],
    'engineering-firm': [
      { id: '1', name: 'Erica', role: 'Simulation Expert', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-emerald-500' },
      { id: '2', name: 'Calvin', role: 'Structural Engineer', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-brand-green' },
      { id: '3', name: 'Taylor', role: 'Project Reporter', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-brand-blue' },
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to AI Professional</h1>
          <p className="mt-3 text-lg text-gray-600">
            Select your professional environment to get started
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {environments.map((env) => (
            <Card 
              key={env.id}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedEnvironment === env.id 
                  ? 'ring-2 ring-brand-purple ring-offset-2' 
                  : 'hover:border-brand-purple/50'
              }`}
              onClick={() => setSelectedEnvironment(env.id)}
            >
              <div className="flex items-start">
                <div className={`${env.color} p-3 rounded-lg text-white mr-4`}>
                  {env.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{env.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{env.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleContinue}
            className="bg-brand-purple hover:bg-brand-purple/90 text-white px-6"
            disabled={!selectedEnvironment || isLoading}
          >
            {isLoading ? "Setting up..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
