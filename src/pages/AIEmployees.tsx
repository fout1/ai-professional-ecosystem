
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import aiService, { AIEmployee as AIEmployeeType } from '@/services/aiService';

const AIEmployees = () => {
  const [aiEmployees, setAiEmployees] = useState<AIEmployeeType[]>([]);
  const [hoveredEmployee, setHoveredEmployee] = useState<string | null>(null);
  const [environmentName, setEnvironmentName] = useState('');
  
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
      
      let employeeRoles: {name: string, color: string}[] = [];
      
      switch (businessType) {
        case 'startup':
          employeeRoles = [
            { name: 'Growth Hacker', color: 'bg-gradient-to-br from-purple-500 to-pink-600' },
            { name: 'Product Manager', color: 'bg-gradient-to-br from-blue-500 to-indigo-600' }
          ];
          break;
        case 'smb':
          employeeRoles = [
            { name: 'Marketing Specialist', color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
            { name: 'Business Analyst', color: 'bg-gradient-to-br from-emerald-500 to-green-600' }
          ];
          break;
        case 'enterprise':
          employeeRoles = [
            { name: 'Corporate Strategist', color: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
            { name: 'Market Analyst', color: 'bg-gradient-to-br from-rose-500 to-red-600' }
          ];
          break;
        case 'freelancer':
          employeeRoles = [
            { name: 'Project Manager', color: 'bg-gradient-to-br from-purple-500 to-pink-600' },
            { name: 'Content Writer', color: 'bg-gradient-to-br from-amber-500 to-orange-600' }
          ];
          break;
        default:
          employeeRoles = [
            { name: 'Research Assistant', color: 'bg-gradient-to-br from-purple-500 to-pink-600' },
            { name: 'Content Writer', color: 'bg-gradient-to-br from-amber-500 to-orange-600' }
          ];
      }
      
      // Create the default employees
      const newEmployees = employeeRoles.map(role => 
        aiService.addCustomEmployee(
          role.name,
          role.name,
          '/placeholder.svg',
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
    // Handle employee click - in a full implementation, this would open a chat
    const employee = aiService.getEmployeeById(employeeId);
    if (employee) {
      toast.info(`Starting conversation with ${employee.name}`);
    }
  };
  
  const handleAddEmployee = () => {
    // In a full implementation, this would open a modal to create a new AI employee
    toast.info("Creating a new AI team member");
    
    // For demo purposes, add a random employee
    const roles = ['Research Assistant', 'Content Writer', 'SEO Specialist', 'Data Analyzer'];
    const colors = [
      'bg-gradient-to-br from-indigo-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-amber-500 to-orange-600',
      'bg-gradient-to-br from-emerald-500 to-green-600'
    ];
    
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newEmployee = aiService.addCustomEmployee(randomRole, randomRole, '/placeholder.svg', randomColor);
    setAiEmployees([...aiEmployees, newEmployee]);
    
    toast.success(`Added new ${randomRole} to your team!`);
  };
  
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
  
  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse' as const,
    }
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
            <Button 
              onClick={handleAddEmployee}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {aiEmployees.map((employee) => (
            <motion.div
              key={employee.id}
              variants={itemVariants}
              className={`${employee.color} rounded-xl p-6 h-[300px] relative overflow-hidden`}
              whileHover={{ y: -5, scale: 1.02 }}
              onHoverStart={() => setHoveredEmployee(employee.id)}
              onHoverEnd={() => setHoveredEmployee(null)}
              onClick={() => handleEmployeeClick(employee.id)}
            >
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/50"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, Math.random() * 30 - 15],
                      x: [0, Math.random() * 30 - 15],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/30"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <h3 className="text-xl font-semibold text-white">{employee.name}</h3>
                  <p className="text-sm text-white/70">{employee.role}</p>
                </div>
                
                <div className="flex justify-center items-center flex-1">
                  <motion.img
                    src={employee.avatar || "/placeholder.svg"}
                    alt={`${employee.name} AI avatar`}
                    className="w-32 h-32 object-contain drop-shadow-xl"
                    animate={hoveredEmployee === employee.id ? floatAnimation : {}}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                <motion.div 
                  className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredEmployee === employee.id ? 1 : 0 }}
                >
                  <Bot className="w-3.5 h-3.5 mr-1.5" />
                  <span>AI Assistant</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
          
          {aiEmployees.length === 0 && (
            <motion.div 
              variants={itemVariants}
              className="col-span-full p-12 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center"
            >
              <Users className="w-16 h-16 text-purple-400 mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">No AI Team Members Yet</h2>
              <p className="text-purple-300 mb-6 max-w-md">
                Add your first AI team member to help with tasks and answer questions
              </p>
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
    </Layout>
  );
};

export default AIEmployees;
