import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Users, Bot, Search, Brain, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AIEmployeeTrainer from '@/components/AIEmployeeTrainer';
import AIEmployee from '@/components/AIEmployee';
import aiService, { AIEmployee as AIEmployeeType } from '@/services/aiService';

const AIEmployees = () => {
  const [aiEmployees, setAiEmployees] = useState<AIEmployeeType[]>([]);
  const [hoveredEmployee, setHoveredEmployee] = useState<string | null>(null);
  const [environmentName, setEnvironmentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<AIEmployeeType | null>(null);
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding !== 'true') {
      window.location.href = '/onboarding';
      return;
    }

    const envName = localStorage.getItem('environmentName');
    if (envName) {
      setEnvironmentName(envName);
    }
    
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
    
    const employees = aiService.getEmployees();
    setAiEmployees(employees);
    
    if (employees.length === 0) {
      createDefaultEmployees();
    }
  }, []);
  
  const createDefaultEmployees = () => {
    const company = localStorage.getItem('company');
    if (!company) return;
    
    try {
      const companyData = JSON.parse(company);
      const businessType = companyData.businessType || '';
      
      let employeeRoles: {name: string, color: string, avatar: string}[] = [];
      
      switch (businessType) {
        case 'startup':
          employeeRoles = [
            { 
              name: 'Growth Hacker', 
              color: 'bg-gradient-to-br from-purple-500 to-pink-600',
              avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png'
            },
            { 
              name: 'Product Manager', 
              color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
              avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png'
            },
            { 
              name: 'Investment Analyst', 
              color: 'bg-gradient-to-br from-emerald-500 to-green-600',
              avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png'
            }
          ];
          break;
        case 'smb':
          employeeRoles = [
            { 
              name: 'Marketing Specialist', 
              color: 'bg-gradient-to-br from-amber-500 to-orange-600',
              avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png'
            },
            { 
              name: 'Business Analyst', 
              color: 'bg-gradient-to-br from-emerald-500 to-green-600',
              avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png'
            },
            { 
              name: 'Customer Relations', 
              color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
              avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png'
            }
          ];
          break;
        case 'enterprise':
          employeeRoles = [
            { 
              name: 'Corporate Strategist', 
              color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
              avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png'
            },
            { 
              name: 'Market Analyst', 
              color: 'bg-gradient-to-br from-rose-500 to-red-600',
              avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png'
            },
            { 
              name: 'Policy Expert', 
              color: 'bg-gradient-to-br from-purple-500 to-pink-600',
              avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png'
            }
          ];
          break;
        case 'freelancer':
          employeeRoles = [
            { 
              name: 'Project Manager', 
              color: 'bg-gradient-to-br from-purple-500 to-pink-600',
              avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png'
            },
            { 
              name: 'Content Writer', 
              color: 'bg-gradient-to-br from-amber-500 to-orange-600',
              avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png'
            },
            { 
              name: 'Client Relationship', 
              color: 'bg-gradient-to-br from-emerald-500 to-green-600',
              avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png'
            }
          ];
          break;
        default:
          employeeRoles = [
            { 
              name: 'Research Assistant', 
              color: 'bg-gradient-to-br from-purple-500 to-pink-600',
              avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png'
            },
            { 
              name: 'Content Writer', 
              color: 'bg-gradient-to-br from-amber-500 to-orange-600',
              avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png'
            },
            { 
              name: 'Data Analyst', 
              color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
              avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png'
            }
          ];
      }
      
      const newEmployees = employeeRoles.map(role => {
        let specialties: string[] = [];
        
        if (businessType === 'startup') {
          specialties = ['startup growth', 'market fit', 'investment', 'scaling', 'product development'];
        } else if (businessType === 'smb') {
          specialties = ['local marketing', 'customer retention', 'operations', 'staff management', 'budgeting'];
        } else if (businessType === 'enterprise') {
          specialties = ['corporate strategy', 'market analysis', 'regulatory compliance', 'global operations'];
        } else if (businessType === 'freelancer') {
          specialties = ['client management', 'portfolio development', 'time tracking', 'contract negotiation'];
        } else {
          specialties = ['research', 'content', 'analysis', 'productivity'];
        }
        
        return aiService.addCustomEmployeeWithSpecialties(
          role.name,
          role.name,
          role.avatar,
          role.color,
          specialties
        );
      });
      
      setAiEmployees(newEmployees);
      toast.success(`AI team created for ${companyName || 'your company'}`);
    } catch (error) {
      console.error('Error creating default employees:', error);
    }
  };
  
  const handleEmployeeClick = (employeeId: string) => {
    const employee = aiService.getEmployeeById(employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setIsTrainerOpen(true);
    }
  };
  
  const handleAddEmployee = () => {
    const businessSpecificRoles = {
      'startup': [
        { name: 'Pitch Deck Creator', avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png' },
        { name: 'Investor Relations', avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png' }
      ],
      'smb': [
        { name: 'Local SEO Expert', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png' },
        { name: 'HR Assistant', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png' }
      ],
      'enterprise': [
        { name: 'Compliance Officer', avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png' },
        { name: 'Executive Briefer', avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png' }
      ],
      'freelancer': [
        { name: 'Invoice Manager', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png' },
        { name: 'Lead Generator', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png' }
      ]
    };
    
    const generalRoles = [
      { name: 'Research Assistant', avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png' },
      { name: 'Content Writer', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png' },
      { name: 'SEO Specialist', avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png' },
      { name: 'Data Analyzer', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png' }
    ];
    
    const roles = businessType && businessSpecificRoles[businessType as keyof typeof businessSpecificRoles] 
      ? businessSpecificRoles[businessType as keyof typeof businessSpecificRoles] 
      : generalRoles;
    
    const colors = [
      'bg-gradient-to-br from-indigo-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-amber-500 to-orange-600',
      'bg-gradient-to-br from-emerald-500 to-green-600'
    ];
    
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    let specialties: string[] = [];
    if (businessType === 'startup') {
      specialties = ['startup growth', 'market fit', 'investment', 'scaling', 'product development'];
    } else if (businessType === 'smb') {
      specialties = ['local marketing', 'customer retention', 'operations', 'staff management', 'budgeting'];
    } else if (businessType === 'enterprise') {
      specialties = ['corporate strategy', 'market analysis', 'regulatory compliance', 'global operations'];
    } else if (businessType === 'freelancer') {
      specialties = ['client management', 'portfolio development', 'time tracking', 'contract negotiation'];
    } else {
      specialties = ['research', 'content', 'analysis', 'productivity'];
    }
    
    const newEmployee = aiService.addCustomEmployeeWithSpecialties(
      randomRole.name, 
      randomRole.name, 
      randomRole.avatar, 
      randomColor,
      specialties
    );
    
    setAiEmployees([...aiEmployees, newEmployee]);
    toast.success(`Added new ${randomRole.name} to your ${companyName || 'company'} team!`);
  };
  
  const handleCloseTrainer = () => {
    setIsTrainerOpen(false);
    const employees = aiService.getEmployees();
    setAiEmployees(employees);
  };

  const filteredEmployees = searchQuery.trim() 
    ? aiEmployees.filter(employee => 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        employee.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : aiEmployees;
  
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
    visible: { y: 0, opacity: 1 }
  };

  const getTeamTitle = () => {
    if (companyName) {
      return `${companyName}'s AI Team`;
    }
    
    switch (businessType) {
      case 'startup':
        return 'Startup Growth Team';
      case 'smb':
        return 'Business Operations Team';
      case 'enterprise':
        return 'Enterprise Strategy Team';
      case 'freelancer':
        return 'Freelance Support Team';
      default:
        return 'AI Team';
    }
  };

  const getTeamDescription = () => {
    if (companyName) {
      switch (businessType) {
        case 'startup':
          return `AI assistants tailored for ${companyName}'s growth`;
        case 'smb':
          return `AI specialists for ${companyName}'s operations`;
        case 'enterprise':
          return `Enterprise-grade AI support for ${companyName}`;
        case 'freelancer':
          return `Your AI team to power ${companyName}`;
        default:
          return `AI Assistants for ${companyName}`;
      }
    }
    
    return `Your AI Assistants for ${environmentName || 'Professional AI'}`;
  };
  
  return (
    <Layout>
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{getTeamTitle()}</h1>
              <p className="text-purple-300">{getTeamDescription()}</p>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <Input 
                  placeholder="Search employees..."
                  className="pl-9 bg-white/5 border-white/10 text-white min-w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAddEmployee}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <AIEmployee
                  id={employee.id}
                  name={employee.name}
                  role={employee.role}
                  avatarSrc={employee.avatar}
                  bgColor={employee.color}
                  onClick={handleEmployeeClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredEmployees.length === 0 && (
            <motion.div 
              variants={itemVariants}
              className="col-span-full p-12 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center"
            >
              <Users className="w-16 h-16 text-purple-400 mb-4" />
              {searchQuery.trim() ? (
                <>
                  <h2 className="text-xl font-medium text-white mb-2">No matching AI employees found</h2>
                  <p className="text-purple-300 mb-6">
                    Try a different search term or add a new AI employee
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-medium text-white mb-2">No AI Team Members Yet</h2>
                  <p className="text-purple-300 mb-6 max-w-md">
                    Add your first AI team member to help with tasks and answer questions
                  </p>
                </>
              )}
              <Button
                onClick={handleAddEmployee}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      
      <AIEmployeeTrainer 
        isOpen={isTrainerOpen}
        onClose={handleCloseTrainer}
        employee={selectedEmployee}
      />
    </Layout>
  );
};

export default AIEmployees;
