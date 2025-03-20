
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Brain, 
  FileText, 
  Globe, 
  Upload, 
  Zap, 
  Search, 
  ChevronDown, 
  PlusCircle,
  Send,
  MessageSquare,
  Paperclip,
  Bot
} from 'lucide-react';

const BrainAIPage = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [environmentName, setEnvironmentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snippets, setSnippets] = useState(0);
  const [websites, setWebsites] = useState(0);
  const [files, setFiles] = useState(0);
  
  useEffect(() => {
    // Load environment name
    const envName = localStorage.getItem('environmentName');
    if (envName) {
      setEnvironmentName(envName);
    }
    
    // Initialize with a welcome message
    setMessages([
      {
        role: 'assistant',
        content: `Hello! I'm your ${envName || 'Professional AI'} Brain. You can ask me anything about your data, upload files, or connect websites for me to learn from.`
      }
    ]);
  }, []);
  
  const handleSendMessage = async () => {
    if (!question.trim()) return;
    
    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: 'user', content: question }
    ];
    
    setMessages(newMessages);
    setQuestion('');
    setIsTyping(true);
    setIsLoading(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      // Add AI response after delay
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: `I'm your ${environmentName || 'Professional AI'} Brain. In a complete implementation, I would analyze your documents and provide smart answers. This is a demo response.`
        }
      ]);
      setIsTyping(false);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleFileUpload = () => {
    toast.info("File upload functionality would be implemented with a real backend");
    // Simulate adding a file
    setFiles(files + 1);
  };
  
  const handleAddWebsite = () => {
    toast.info("Website connection would be implemented with a real backend");
    // Simulate adding a website
    setWebsites(websites + 1);
  };
  
  const handleAddSnippet = () => {
    toast.info("Text snippet addition would be implemented with a real backend");
    // Simulate adding a snippet
    setSnippets(snippets + 1);
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
  
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    }
  };
  
  return (
    <Layout>
      <motion.div 
        className="max-w-6xl mx-auto h-[calc(100vh-6rem)] flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-400" />
            {environmentName || 'Professional AI'} Brain
          </h1>
          <p className="text-purple-300">Your personal AI knowledge base</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
          {/* Left sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1 h-full flex flex-col">
            <Card className="bg-white/5 border-white/10 flex-1 overflow-hidden flex flex-col">
              <Tabs defaultValue="sources" className="flex-1 flex flex-col">
                <TabsList className="bg-white/5 border-b border-white/10 p-1">
                  <TabsTrigger value="sources" className="data-[state=active]:bg-white/10">
                    Sources
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="data-[state=active]:bg-white/10">
                    Chats
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="sources" className="p-4 flex-1 overflow-auto">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-white flex items-center">
                        <FileText className="w-4 h-4 mr-1.5 text-purple-400" />
                        Text Snippets ({snippets})
                      </h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={handleAddSnippet}
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                        Add Snippet
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-white flex items-center">
                        <Globe className="w-4 h-4 mr-1.5 text-purple-400" />
                        Websites ({websites})
                      </h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={handleAddWebsite}
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                        Connect Website
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-white flex items-center">
                        <FileText className="w-4 h-4 mr-1.5 text-purple-400" />
                        Files ({files})
                      </h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={handleFileUpload}
                      >
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Upload File
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="chat" className="p-4 flex-1 overflow-auto">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-white">Recent Chats</h3>
                    
                    <div className="space-y-1">
                      <div className="py-2 px-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10">
                        <p className="text-sm text-white">General questions</p>
                        <p className="text-xs text-purple-300">2 minutes ago</p>
                      </div>
                      <div className="py-2 px-3 rounded-lg cursor-pointer hover:bg-white/10">
                        <p className="text-sm text-white">Research analysis</p>
                        <p className="text-xs text-purple-300">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
          
          {/* Chat interface */}
          <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col h-full">
            <Card className="bg-white/5 border-white/10 flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{environmentName || 'Professional AI'} Brain</h3>
                    <p className="text-xs text-purple-300">Connected to your data</p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Capabilities
                  <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-start">
                        {message.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-2 mt-0.5">
                            <Brain className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-white/10 text-white">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-2">
                          <Brain className="w-3.5 h-3.5 text-white" />
                        </div>
                        <motion.div className="flex space-x-1">
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                          />
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-white/10">
                <div className="relative">
                  <Input
                    placeholder="Ask your Brain anything..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-24 py-6 bg-white/5 border-white/10 text-white"
                    disabled={isLoading}
                  />
                  <div className="absolute right-2 top-2 flex items-center space-x-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-purple-300 hover:text-white hover:bg-white/10"
                      onClick={handleFileUpload}
                      disabled={isLoading}
                    >
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button 
                      size="icon"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      onClick={handleSendMessage}
                      disabled={isLoading}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default BrainAIPage;
