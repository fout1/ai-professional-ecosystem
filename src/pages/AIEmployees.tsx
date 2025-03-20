
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
  const [selectedEmployee, setSelectedEmployee] = useState<AIEmployeeType | null>(null);
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Load environment name
    const envName = localStorage.getItem('environmentName');
    if (envName) {
      setEnvironmentName(envName);
    }
    
    // Load AI employees
    const employees = aiService.getAIEmployees();
    setAiEmployees(employees);
    
    if (employees.length === 0) {
      // If no employees, create defaults
      createDefaultEmployees();
    }
  }, []);
  
  const createDefaultEmployees = () => {
    // Create default employees based on business type if none exist
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
            }
          ];
      }
      
      // Create the default employees
      const newEmployees = employeeRoles.map(role => 
        aiService.addCustomEmployee(
          role.name,
          role.name,
          role.avatar,
          role.color
        )
      );
      
      setAiEmployees(newEmployees);
      toast.success("AI team created based on your business type!");
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
    // For demo purposes, add a random employee
    const roles = [
      { name: 'Research Assistant', avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png' },
      { name: 'Content Writer', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png' },
      { name: 'SEO Specialist', avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png' },
      { name: 'Data Analyzer', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png' }
    ];
    const colors = [
      'bg-gradient-to-br from-indigo-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-amber-500 to-orange-600',
      'bg-gradient-to-br from-emerald-500 to-green-600'
    ];
    
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newEmployee = aiService.addCustomEmployee(
      randomRole.name, 
      randomRole.name, 
      randomRole.avatar, 
      randomColor
    );
    
    setAiEmployees([...aiEmployees, newEmployee]);
    toast.success(`Added new ${randomRole.name} to your team!`);
  };
  
  const handleCloseTrainer = () => {
    setIsTrainerOpen(false);
    // Refresh the employees list
    const employees = aiService.getAIEmployees();
    setAiEmployees(employees);
  };

  const filteredEmployees = searchQuery.trim() 
    ? aiEmployees.filter(employee => 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        employee.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : aiEmployees;
  
  // Animation variants
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
              <h1 className="text-2xl font-bold text-white">AI Team</h1>
              <p className="text-purple-300">Your AI Assistants for {environmentName || 'Professional AI'}</p>
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
