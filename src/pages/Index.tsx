
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import AIEmployee from '@/components/AIEmployee';
import AIEmployeeChat from '@/components/AIEmployeeChat';
import DailyTasks from '@/components/DailyTasks';
import BrainAI from '@/components/BrainAI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Lightbulb, MessageSquare, Sparkles, Bot, FileText, BarChart3, Calendar, Clock, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AIEmployeeData {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

const Index = () => {
  const [inputValue, setInputValue] = useState('');
  const [activeChat, setActiveChat] = useState<AIEmployeeData | null>(null);
  const [environmentName, setEnvironmentName] = useState<string>('');
  const [environmentColor, setEnvironmentColor] = useState<string>('');
  const [aiEmployees, setAiEmployees] = useState<AIEmployeeData[]>([]);
  
  // Sample tasks data
  const tasks = [
    { id: '1', title: 'Create customer success metrics', description: 'Set up monitoring KPIs', completed: false, icon: '/placeholder.svg' },
    { id: '2', title: 'Optimize your website conversion', description: 'Improve landing page', completed: false, icon: '/placeholder.svg' },
    { id: '3', title: 'Optimize your Google Business Profile', description: 'Update information', completed: false, icon: '/placeholder.svg' },
  ];
  
  // Sample ideas and questions
  const ideas = 29;
  const questions = 8;
  
  // Stats
  const stats = [
    { label: 'Tasks', value: 24, icon: <Clock className="w-4 h-4 text-white" />, color: 'bg-gradient-to-br from-amber-400 to-orange-500' },
    { label: 'Files', value: 124, icon: <FileText className="w-4 h-4 text-white" />, color: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
    { label: 'Messages', value: 74, icon: <MessageSquare className="w-4 h-4 text-white" />, color: 'bg-gradient-to-br from-emerald-400 to-green-500' },
    { label: 'Sessions', value: 18, icon: <Bot className="w-4 h-4 text-white" />, color: 'bg-gradient-to-br from-pink-400 to-rose-500' },
  ];
  
  useEffect(() => {
    // Load environment data from localStorage
    const storedEnvironmentName = localStorage.getItem('environmentName');
    const storedEnvironmentColor = localStorage.getItem('environmentColor');
    
    if (storedEnvironmentName) {
      setEnvironmentName(storedEnvironmentName);
    }
    
    if (storedEnvironmentColor) {
      setEnvironmentColor(storedEnvironmentColor);
    }
    
    // Load AI employees data from localStorage
    const storedAiEmployees = localStorage.getItem('aiEmployees');
    if (storedAiEmployees) {
      setAiEmployees(JSON.parse(storedAiEmployees));
    } else {
      // Fallback to sample data if nothing is stored yet
      setAiEmployees([
        { id: '1', name: 'Buddy', role: 'Business Development', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-indigo-500 to-blue-600' },
        { id: '2', name: 'Cassie', role: 'Customer Support', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
        { id: '3', name: 'Commet', role: 'eCommerce', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
      ]);
    }
  }, []);
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    toast.success("Question sent to all AI Employees!");
    setInputValue('');
  };
  
  const handleAIEmployeeClick = (employee: AIEmployeeData) => {
    setActiveChat(employee);
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
            onClose={() => setActiveChat(null)}
          />
        </div>
      </Layout>
    );
  }
  
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
    <Layout>
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="mb-8" variants={item}>
          <h1 className="text-2xl font-bold mb-1 text-white flex items-center">
            {environmentName || 'Professional'} Dashboard
            <Sparkles className="w-5 h-5 ml-2 text-purple-400" />
          </h1>
          <p className="text-purple-300">Welcome to your AI Professional workspace</p>
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
            <Input
              className="w-full py-7 pl-6 pr-20 rounded-full border-white/10 bg-white/5 backdrop-blur-md text-white placeholder:text-white/50 shadow-lg focus:border-purple-500"
              placeholder="What's on your mind today?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button 
              className="absolute right-2 top-2 rounded-full w-12 h-12 p-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity"
              size="icon"
              onClick={() => handleSubmit()}
            >
              <Send className="h-5 w-5" />
            </Button>
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white">
                <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs">{ideas} new ideas</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs">{questions} new questions</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-2" variants={item}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">AI Employees</h2>
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                  <PlusCircle className="w-3.5 h-3.5 mr-1" />
                  Add employee
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {aiEmployees.map(employee => (
                  <AIEmployee 
                    key={employee.id}
                    name={employee.name}
                    role={employee.role}
                    avatarSrc={employee.avatar}
                    bgColor={employee.color}
                    onClick={() => handleAIEmployeeClick(employee)}
                  />
                ))}
              </div>
            </div>
            
            <motion.div variants={item}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Automations</h2>
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
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
                      <div className="w-14 h-8 bg-white/10 rounded-full relative px-1 flex items-center cursor-pointer">
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
                      <div className="w-14 h-8 bg-white/10 rounded-full relative px-1 flex items-center cursor-pointer">
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
            <BrainAI snippets={79} websites={12} files={8} name="Aurea" />
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;
