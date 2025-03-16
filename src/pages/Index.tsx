
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import AIEmployee from '@/components/AIEmployee';
import AIEmployeeChat from '@/components/AIEmployeeChat';
import DailyTasks from '@/components/DailyTasks';
import BrainAI from '@/components/BrainAI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Lightbulb, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

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
  
  useEffect(() => {
    // Load environment data from localStorage
    const storedEnvironmentName = localStorage.getItem('environmentName');
    if (storedEnvironmentName) {
      setEnvironmentName(storedEnvironmentName);
    }
    
    // Load AI employees data from localStorage
    const storedAiEmployees = localStorage.getItem('aiEmployees');
    if (storedAiEmployees) {
      setAiEmployees(JSON.parse(storedAiEmployees));
    } else {
      // Fallback to sample data if nothing is stored yet
      setAiEmployees([
        { id: '1', name: 'Buddy', role: 'Business Development', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-brand-blue' },
        { id: '2', name: 'Cassie', role: 'Customer Support', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-blue-500' },
        { id: '3', name: 'Commet', role: 'eCommerce', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-brand-orange' },
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
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{environmentName || 'Professional'} Dashboard</h1>
          <p className="text-gray-600">Welcome to your AI Professional workspace</p>
        </div>
        
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-2xl relative">
            <Input
              className="w-full py-6 pl-4 pr-12 rounded-full border-gray-300 bg-white shadow-sm text-base"
              placeholder="What's on your mind today?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button 
              className="absolute right-1 top-1 rounded-full w-10 h-10 p-0 bg-brand-purple hover:bg-brand-purple-dark"
              size="icon"
              onClick={() => handleSubmit()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200">
              <Lightbulb className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{ideas} new ideas</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{questions} new questions</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">AI Employees</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Automations</h2>
              <div className="space-y-4">
                <div className="bg-brand-purple rounded-xl p-5 flex items-center relative overflow-hidden">
                  <div className="flex-1 text-white">
                    <h3 className="font-semibold">Social Media</h3>
                    <p className="text-sm text-white/70">Auto Poster</p>
                    <div className="mt-4">
                      <div className="w-14 h-8 bg-white/10 rounded-full relative px-1 flex items-center">
                        <div className="w-6 h-6 rounded-full bg-white absolute left-1 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <img 
                      src="/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png" 
                      alt="Social media bot" 
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                </div>
                
                <div className="bg-brand-blue rounded-xl p-5 flex items-center relative overflow-hidden">
                  <div className="flex-1 text-white">
                    <h3 className="font-semibold">Facebook</h3>
                    <p className="text-sm text-white/70">Commenter</p>
                    <div className="mt-4">
                      <div className="w-14 h-8 bg-white/10 rounded-full relative px-1 flex items-center">
                        <div className="w-6 h-6 rounded-full bg-white absolute left-1 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <img 
                      src="/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png" 
                      alt="Facebook commenter bot" 
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <DailyTasks tasks={tasks} />
            <BrainAI snippets={79} websites={1} files={0} name="Aurea" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
