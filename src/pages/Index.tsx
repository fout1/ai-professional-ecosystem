import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AIEmployee from '@/components/AIEmployee';
import AIEmployeeChat from '@/components/AIEmployeeChat';
import DailyTasks from '@/components/DailyTasks';
import BrainAI from '@/components/BrainAI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Lightbulb, MessageSquare, Sparkles, Bot, FileText, Clock, PlusCircle, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import aiService, { AIEmployee as AIEmployeeType } from '@/services/aiService';

const Index = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [activeChat, setActiveChat] = useState<AIEmployeeType | null>(null);
  const [environmentName, setEnvironmentName] = useState<string>('');
  const [environmentColor, setEnvironmentColor] = useState<string>('');
  const [aiEmployees, setAiEmployees] = useState<AIEmployeeType[]>([]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [businessType, setBusinessType] = useState<string>('');
  const [userStats, setUserStats] = useState({
    tasks: 0,
    files: 0,
    messages: 0,
    sessions: 0
  });
  const [isAnalyzingQuestion, setIsAnalyzingQuestion] = useState(false);
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [ideas, setIdeas] = useState(0);
  const [questions, setQuestions] = useState(0);
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding !== 'true') {
      console.log('Redirecting to onboarding');
      navigate('/onboarding');
      return;
    }
    
    loadUserPreferences();
  }, [navigate]);
  
  const loadUserPreferences = () => {
    try {
      const envName = localStorage.getItem('environmentName');
      if (envName) {
        setEnvironmentName(envName);
      }
      
      const envColor = localStorage.getItem('environmentColor');
      if (envColor) {
        setEnvironmentColor(envColor);
      }
      
      const companyStr = localStorage.getItem('company');
      if (companyStr) {
        const companyData = JSON.parse(companyStr);
        setCompanyData(companyData);
        setBusinessType(companyData.businessType || '');
      }
      
      const employees = aiService.getAIEmployees();
      if (employees.length > 0) {
        setAiEmployees(employees);
      } else {
        createDefaultEmployees();
      }

      const brainItems = aiService.getBrainItems('current-user');
      
      setUserStats({
        tasks: tasks.length,
        files: aiService.getBrainItems('current-user', 'file').length,
        messages: employees.reduce((total, emp) => total + aiService.getConversationHistory(emp.id).length, 0),
        sessions: parseInt(localStorage.getItem('sessionCount') || '0')
      });

      loadBusinessSpecificTasks();
    } catch (error) {
      console.error('Error loading user preferences:', error);
      toast.error("Error loading your preferences");
    }
  };

  const loadBusinessSpecificTasks = () => {
    const company = localStorage.getItem('company');
    if (!company) return;
    
    try {
      const companyData = JSON.parse(company);
      const businessType = companyData.businessType || '';
      const companyName = companyData.name || '';
      
      let businessTasks = [];
      
      switch(businessType) {
        case 'startup':
          businessTasks = [
            { id: '1', title: `Update ${companyName} growth strategy`, completed: false },
            { id: '2', title: 'Research competitor pricing', completed: false },
            { id: '3', title: 'Schedule investor presentation', completed: false }
          ];
          break;
        case 'smb':
          businessTasks = [
            { id: '1', title: `Review ${companyName} quarterly budget`, completed: false },
            { id: '2', title: 'Prepare employee training materials', completed: false },
            { id: '3', title: 'Update client contract templates', completed: false }
          ];
          break;
        case 'enterprise':
          businessTasks = [
            { id: '1', title: `Review ${companyName} departmental reports`, completed: false },
            { id: '2', title: 'Schedule quarterly board meeting', completed: false },
            { id: '3', title: 'Analyze market expansion opportunities', completed: false }
          ];
          break;
        case 'freelancer':
          businessTasks = [
            { id: '1', title: 'Send client invoices', completed: false },
            { id: '2', title: 'Update portfolio with recent work', completed: false },
            { id: '3', title: `Schedule ${companyName} service promotion`, completed: false }
          ];
          break;
        default:
          businessTasks = [
            { id: '1', title: 'Review quarterly goals', completed: false },
            { id: '2', title: 'Schedule team meeting', completed: false },
            { id: '3', title: 'Prepare project overview', completed: false }
          ];
      }
      
      setTasks(businessTasks);
      
      setUserStats(prev => ({
        ...prev,
        tasks: businessTasks.length
      }));
      
      const ideasCount = Math.floor(Math.random() * 5) + 1;
      const questionsCount = Math.floor(Math.random() * 7) + 2;
      
      setIdeas(ideasCount);
      setQuestions(questionsCount);
      
    } catch (error) {
      console.error('Error loading business-specific tasks:', error);
    }
  };
  
  const createDefaultEmployees = () => {
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
      
      const newEmployees = employeeRoles.map(role => 
        aiService.addCustomEmployee(
          role.name,
          role.name,
          '/placeholder.svg',
          role.color
        )
      );
      
      setAiEmployees(newEmployees);
      toast.success("Default AI team created based on your business type!");
    } catch (error) {
      console.error('Error creating default employees:', error);
    }
  };
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (aiEmployees.length > 0) {
      setIsAnalyzingQuestion(true);
      
      try {
        const bestEmployee = aiService.findBestEmployeeForQuestion(inputValue);
        
        if (bestEmployee) {
          toast.success(`Routing your question to ${bestEmployee.name}, who can best assist with this topic!`);
          
          setUserStats(prev => ({
            ...prev,
            messages: prev.messages + 1
          }));
          
          aiService.addBrainItem({
            type: 'snippet',
            content: inputValue,
            title: `Question: ${inputValue.substring(0, 30)}...`,
            date: new Date(),
            userId: 'current-user'
          });
          
          setInputValue('');
          
          setTimeout(() => {
            setActiveChat(bestEmployee);
            setIsAnalyzingQuestion(false);
          }, 1500);
        } else {
          toast.error("Could not find an appropriate AI employee for your question");
          setIsAnalyzingQuestion(false);
        }
      } catch (error) {
        console.error("Error routing question:", error);
        toast.error("Error routing your question");
        setIsAnalyzingQuestion(false);
      }
    } else {
      toast.error("No AI Employees available. Adding some for you...");
      createDefaultEmployees();
      setIsAnalyzingQuestion(false);
    }
  };
  
  const handleAIEmployeeClick = (employeeId: string) => {
    const employee = aiService.getEmployeeById(employeeId);
    if (employee) {
      setActiveChat(employee);
      
      const currentSessions = parseInt(localStorage.getItem('sessionCount') || '0');
      localStorage.setItem('sessionCount', (currentSessions + 1).toString());
      
      setUserStats(prev => ({
        ...prev,
        sessions: prev.sessions + 1
      }));
    } else {
      toast.error("Employee not found");
    }
  };

  const handleAddEmployee = () => {
    toast.info("In a full implementation, this would open a dialog to create a new AI Employee");
    
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

  const handleToggleAutomation = (index: number) => {
    toast.success(`Automation ${index === 0 ? 'Social Media' : 'Email'} toggled!`);
  };
  
  if (activeChat) {
    return (
      <Layout>
        <div className="h-[calc(100vh-6rem)]">
          <AIEmployeeChat 
            name={activeChat.name}
            role={activeChat.role}
            avatarSrc={activeChat.avatar}
            bgColor={activeChat.color}
            employeeId={activeChat.id}
            onClose={() => setActiveChat(null)}
          />
        </div>
      </Layout>
    );
  }
  
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
  
  const getPersonalizedGreeting = () => {
    const company = localStorage.getItem('company');
    if (!company) return 'Welcome to your AI Professional workspace';
    
    try {
      const companyData = JSON.parse(company);
      const businessType = companyData.businessType || '';
      const companyName = companyData.name || '';
      
      if (companyName) {
        switch (businessType) {
          case 'startup':
            return `Accelerate ${companyName}'s growth with AI-powered insights`;
          case 'smb':
            return `Streamline ${companyName}'s operations with AI assistance`;
          case 'enterprise':
            return `Enterprise-grade AI tools to scale ${companyName}'s operations`;
          case 'freelancer':
            return `Your personal AI team to boost ${companyName}`;
          default:
            return `Welcome to ${companyName}'s AI workspace`;
        }
      }
      
      switch (businessType) {
        case 'startup':
          return 'Ready to disrupt the market with AI-powered growth';
        case 'smb':
          return 'Streamline your business operations with AI assistance';
        case 'enterprise':
          return 'Enterprise-grade AI tools to scale your operations';
        case 'freelancer':
          return 'Your personal AI team to boost your freelance business';
        default:
          return 'Welcome to your AI Professional workspace';
      }
    } catch (error) {
      console.error('Error getting personalized greeting:', error);
      return 'Welcome to your AI Professional workspace';
    }
  };
  
  const stats = [
    { label: 'Tasks', value: userStats.tasks, icon: <Clock className="w-4 h-4 text-white" />, color: 'bg-gradient-to-br from-amber-400 to-orange-500' },
    { label: 'Files', value: userStats.files, icon: <FileText className="w-4 h-4 text-white" />, color: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
    { label: 'Messages', value: userStats.messages, icon: <MessageSquare className="w-4 h-4 text-white" />, color: 'bg-gradient-to-br from-emerald-400 to-green-500' },
    { label: 'Sessions', value: userStats.sessions, icon: <Bot className="w-4 h-4 text-white" />, color: 'bg-gradient-to-br from-pink-400 to-rose-500' },
  ];
  
  return (
    <Layout>
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="mb-8" variants={item}>
          <h1 className="text-2xl font-bold mb-1 text-white flex items-center">
            {environmentName || 'Professional AI'} Dashboard
            <Sparkles className="w-5 h-5 ml-2 text-purple-400" />
          </h1>
          <p className="text-purple-300">{getPersonalizedGreeting()}</p>
        </motion.div>
        
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" variants={item}>
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center">
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mr-3`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-purple-300">{stat.label}</p>
                <p className="text-xl font-semibold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
        
        <motion.div className="flex justify-center mb-10" variants={item}>
          <div className="w-full max-w-3xl relative">
            <form onSubmit={handleSubmit}>
              <Input
                className="w-full py-7 pl-6 pr-20 rounded-full border-white/10 bg-white/5 backdrop-blur-md text-white placeholder:text-white/50 shadow-lg focus:border-purple-500"
                placeholder="What's on your mind today? I'll find the right AI expert for you"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isAnalyzingQuestion}
              />
              <Button 
                type="submit"
                className="absolute right-2 top-2 rounded-full w-12 h-12 p-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity"
                size="icon"
                disabled={isAnalyzingQuestion || !inputValue.trim()}
              >
                {isAnalyzingQuestion ? (
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-opacity-20 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white">
                <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs">{ideas} new ideas</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs">{questions} new questions</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs">{userStats.files} knowledge items</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-2" variants={item}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">AI Employees</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  onClick={handleAddEmployee}
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" />
                  Add employee
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {aiEmployees.map(employee => (
                  <AIEmployee 
                    key={employee.id}
                    id={employee.id}
                    name={employee.name}
                    role={employee.role}
                    avatarSrc={employee.avatar}
                    bgColor={employee.color}
                    onClick={handleAIEmployeeClick}
                  />
                ))}
                
                {aiEmployees.length === 0 && (
                  <div className="col-span-3 p-8 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center">
                    <Sparkles className="w-10 h-10 text-purple-400 mb-4" />
                    <h3 className="text-white font-medium mb-2">No AI Employees yet</h3>
                    <p className="text-purple-300 text-sm mb-4">Add your first AI Employee to get started</p>
                    <Button
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      onClick={handleAddEmployee}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add employee
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <motion.div variants={item}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Automations</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  onClick={() => toast.info("Automation management would be fully implemented with a backend")}
                >
                  Manage
                </Button>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 flex items-center relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                  
                  <div className="flex-1 text-white z-10">
                    <h3 className="font-semibold">Social Media</h3>
                    <p className="text-sm text-white/70">Auto Poster</p>
                    <div className="mt-4">
                      <div 
                        className="w-14 h-8 bg-white/10 rounded-full relative px-1 flex items-center cursor-pointer"
                        onClick={() => handleToggleAutomation(0)}
                      >
                        <div className="w-6 h-6 rounded-full bg-white absolute left-1 shadow-sm transition-all"></div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto z-10">
                    <img 
                      src="/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png" 
                      alt="Social media bot" 
                      className="w-24 h-24 object-contain drop-shadow-lg" 
                    />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-5 flex items-center relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                  
                  <div className="flex-1 text-white z-10">
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-sm text-white/70">Responder</p>
                    <div className="mt-4">
                      <div 
                        className="w-14 h-8 bg-white/10 rounded-full relative px-1 flex items-center cursor-pointer"
                        onClick={() => handleToggleAutomation(1)}
                      >
                        <div className="w-6 h-6 rounded-full bg-white absolute left-1 shadow-sm transition-all"></div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto z-10">
                    <img 
                      src="/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png" 
                      alt="Email bot" 
                      className="w-24 h-24 object-contain drop-shadow-lg" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div className="lg:col-span-1 space-y-6" variants={item}>
            <DailyTasks tasks={tasks} />
            <BrainAI 
              snippets={aiService.getBrainItems('current-user', 'snippet').length} 
              websites={aiService.getBrainItems('current-user', 'website').length} 
              files={aiService.getBrainItems('current-user', 'file').length} 
              name={environmentName || "Professional AI"} 
            />
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;
