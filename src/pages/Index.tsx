
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import AIEmployee from '@/components/AIEmployee';
import DailyTasks from '@/components/DailyTasks';
import BrainAI from '@/components/BrainAI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Lightbulb, MessageSquare } from 'lucide-react';

const Index = () => {
  const [inputValue, setInputValue] = useState('');
  
  // Sample AI employees data
  const aiEmployees = [
    { id: '1', name: 'Buddy', role: 'Business Development', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-brand-blue' },
    { id: '2', name: 'Cassie', role: 'Customer Support', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-blue-500' },
    { id: '3', name: 'Commet', role: 'eCommerce', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-brand-orange' },
    { id: '4', name: 'Dexter', role: 'Data Analyst', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-amber-500' },
    { id: '5', name: 'Emmie', role: 'Email Marketer', avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png', color: 'bg-yellow-500' },
    { id: '6', name: 'Gigi', role: 'Personal Development', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-brand-green' },
    { id: '7', name: 'Milli', role: 'Sales Manager', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-brand-purple' },
    { id: '8', name: 'Penn', role: 'Copywriter', avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png', color: 'bg-emerald-500' },
  ];
  
  // Sample tasks data
  const tasks = [
    { id: '1', title: 'Create customer success metrics', description: 'Set up monitoring KPIs', completed: false, icon: '/placeholder.svg' },
    { id: '2', title: 'Optimize your website conversion', description: 'Improve landing page', completed: false, icon: '/placeholder.svg' },
    { id: '3', title: 'Optimize your Google Business Profile', description: 'Update information', completed: false, icon: '/placeholder.svg' },
  ];
  
  // Sample ideas and questions
  const ideas = 29;
  const questions = 8;
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
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
