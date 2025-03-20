
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
  Bot,
  Link,
  X,
  Trash2,
  Save,
  Copy,
  Edit,
  FileCode
} from 'lucide-react';

interface BrainItem {
  id: string;
  type: 'snippet' | 'website' | 'file';
  name: string;
  content: string;
  date: Date;
  url?: string;
  fileType?: string;
}

const BrainAIPage = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [environmentName, setEnvironmentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [brainItems, setBrainItems] = useState<BrainItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addType, setAddType] = useState<'snippet' | 'website' | 'file'>('snippet');
  const [snippetName, setSnippetName] = useState('');
  const [snippetContent, setSnippetContent] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedItem, setSelectedItem] = useState<BrainItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load environment name
    const envName = localStorage.getItem('environmentName');
    if (envName) {
      setEnvironmentName(envName);
    }
    
    // Load brain items from localStorage
    const storedItems = localStorage.getItem('brainItems');
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        // Convert string dates back to Date objects
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
        setBrainItems(itemsWithDates);
      } catch (error) {
        console.error("Error loading brain items:", error);
      }
    }
    
    // Initialize with a welcome message
    setMessages([
      {
        role: 'assistant',
        content: `Hello! I'm your ${envName || 'Professional AI'} Brain. You can ask me anything about your data, upload files, or connect websites for me to learn from.`
      }
    ]);
  }, []);
  
  // Save brain items whenever they change
  useEffect(() => {
    localStorage.setItem('brainItems', JSON.stringify(brainItems));
  }, [brainItems]);
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
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
    
    try {
      // Get information about brain items to use in the response
      const snippetsCount = brainItems.filter(item => item.type === 'snippet').length;
      const websitesCount = brainItems.filter(item => item.type === 'website').length;
      const filesCount = brainItems.filter(item => item.type === 'file').length;
      
      // Prepare context from brain items
      let context = '';
      if (brainItems.length > 0) {
        // Add some context from the brain items
        const relevantItems = brainItems.slice(0, 3); // Just use a few items for demo
        context = "Based on your brain data:\n";
        
        relevantItems.forEach(item => {
          if (item.type === 'snippet') {
            context += `- From your "${item.name}" note: ${item.content.substring(0, 100)}...\n`;
          } else if (item.type === 'website') {
            context += `- From website "${item.name}": Some extracted content would be here...\n`;
          } else if (item.type === 'file') {
            context += `- From file "${item.name}": File content would be processed here...\n`;
          }
        });
      }
      
      // Simulate AI thinking
      setTimeout(() => {
        // Add AI response after delay
        const aiResponse = `I've analyzed your question${brainItems.length > 0 ? ' along with your stored data' : ''}.
        
${context}

You currently have ${snippetsCount} text snippets, ${websitesCount} websites, and ${filesCount} files in your brain. 

In a complete implementation with Supabase and OpenAI integration, I would use GPT-4.5 to provide detailed answers based on your brain's knowledge. This demo shows the UI for adding and managing brain content.

Would you like me to help you add more content to your brain?`;
        
        setMessages([
          ...newMessages,
          { role: 'assistant', content: aiResponse }
        ]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to generate response");
      setIsTyping(false);
      setIsLoading(false);
    }
  };
  
  const handleAddItem = () => {
    setIsAddDialogOpen(true);
  };
  
  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setSnippetName('');
    setSnippetContent('');
    setWebsiteUrl('');
    setWebsiteName('');
    setSelectedFile(null);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleAddItemSubmit = () => {
    const newItem: BrainItem = {
      id: crypto.randomUUID(),
      type: addType,
      name: '',
      content: '',
      date: new Date(),
    };
    
    if (addType === 'snippet') {
      if (!snippetName.trim() || !snippetContent.trim()) {
        toast.error("Please provide both a name and content for your snippet");
        return;
      }
      newItem.name = snippetName;
      newItem.content = snippetContent;
    } else if (addType === 'website') {
      if (!websiteUrl.trim()) {
        toast.error("Please provide a website URL");
        return;
      }
      newItem.name = websiteName || new URL(websiteUrl).hostname;
      newItem.content = `Content from ${websiteUrl}`;
      newItem.url = websiteUrl;
    } else if (addType === 'file') {
      if (!selectedFile) {
        toast.error("Please select a file to upload");
        return;
      }
      newItem.name = selectedFile.name;
      newItem.content = `Content of file ${selectedFile.name}`;
      newItem.fileType = selectedFile.type;
    }
    
    setBrainItems([newItem, ...brainItems]);
    toast.success(`Added ${addType} to your brain!`);
    handleAddDialogClose();
  };
  
  const handleViewItem = (item: BrainItem) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };
  
  const handleEditItem = () => {
    if (!selectedItem) return;
    
    if (selectedItem.type === 'snippet') {
      setSnippetName(selectedItem.name);
      setSnippetContent(selectedItem.content);
    } else if (selectedItem.type === 'website') {
      setWebsiteName(selectedItem.name);
      setWebsiteUrl(selectedItem.url || '');
    }
    
    setAddType(selectedItem.type);
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (!selectedItem) return;
    
    const updatedItems = brainItems.map(item => {
      if (item.id === selectedItem.id) {
        if (selectedItem.type === 'snippet') {
          return {
            ...item,
            name: snippetName,
            content: snippetContent,
            date: new Date()
          };
        } else if (selectedItem.type === 'website') {
          return {
            ...item,
            name: websiteName,
            url: websiteUrl,
            date: new Date()
          };
        }
      }
      return item;
    });
    
    setBrainItems(updatedItems);
    toast.success("Item updated successfully!");
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };
  
  const handleDeleteItem = () => {
    if (!selectedItem) return;
    
    const updatedItems = brainItems.filter(item => item.id !== selectedItem.id);
    setBrainItems(updatedItems);
    toast.success("Item deleted successfully!");
    setIsViewDialogOpen(false);
    setSelectedItem(null);
  };
  
  const countItemsByType = (type: 'snippet' | 'website' | 'file') => {
    return brainItems.filter(item => item.type === type).length;
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
                        Text Snippets ({countItemsByType('snippet')})
                      </h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={() => {
                          setAddType('snippet');
                          handleAddItem();
                        }}
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                        Add Snippet
                      </Button>
                      
                      <div className="mt-3 space-y-2 max-h-[120px] overflow-y-auto">
                        {brainItems
                          .filter(item => item.type === 'snippet')
                          .map(item => (
                            <div 
                              key={item.id}
                              className="text-xs p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer flex items-center"
                              onClick={() => handleViewItem(item)}
                            >
                              <FileText className="w-3 h-3 mr-1.5 text-purple-400 flex-shrink-0" />
                              <span className="truncate">{item.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-white flex items-center">
                        <Globe className="w-4 h-4 mr-1.5 text-purple-400" />
                        Websites ({countItemsByType('website')})
                      </h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={() => {
                          setAddType('website');
                          handleAddItem();
                        }}
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                        Connect Website
                      </Button>
                      
                      <div className="mt-3 space-y-2 max-h-[120px] overflow-y-auto">
                        {brainItems
                          .filter(item => item.type === 'website')
                          .map(item => (
                            <div 
                              key={item.id}
                              className="text-xs p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer flex items-center"
                              onClick={() => handleViewItem(item)}
                            >
                              <Globe className="w-3 h-3 mr-1.5 text-purple-400 flex-shrink-0" />
                              <span className="truncate">{item.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-white flex items-center">
                        <FileText className="w-4 h-4 mr-1.5 text-purple-400" />
                        Files ({countItemsByType('file')})
                      </h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
                        onClick={() => {
                          setAddType('file');
                          handleAddItem();
                        }}
                      >
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Upload File
                      </Button>
                      
                      <div className="mt-3 space-y-2 max-h-[120px] overflow-y-auto">
                        {brainItems
                          .filter(item => item.type === 'file')
                          .map(item => (
                            <div 
                              key={item.id}
                              className="text-xs p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer flex items-center"
                              onClick={() => handleViewItem(item)}
                            >
                              <FileCode className="w-3 h-3 mr-1.5 text-purple-400 flex-shrink-0" />
                              <span className="truncate">{item.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="chat" className="p-4 flex-1 overflow-auto">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-white">Recent Chats</h3>
                    
                    <div className="space-y-1">
                      <div className="py-2 px-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10">
                        <p className="text-sm text-white">Brain conversation</p>
                        <p className="text-xs text-purple-300">Just now</p>
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
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  onClick={handleAddItem}
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                  Add to Brain
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
                        <div className="text-sm whitespace-pre-line">{message.content}</div>
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
                
                <div ref={messagesEndRef} />
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
                      onClick={handleAddItem}
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
      
      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-[#1A0D3A] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {addType === 'snippet' && <FileText className="w-5 h-5 mr-2 text-purple-400" />}
              {addType === 'website' && <Globe className="w-5 h-5 mr-2 text-purple-400" />}
              {addType === 'file' && <Upload className="w-5 h-5 mr-2 text-purple-400" />}
              Add to Brain: {addType.charAt(0).toUpperCase() + addType.slice(1)}
            </DialogTitle>
            <DialogDescription className="text-purple-300">
              {addType === 'snippet' && "Add text knowledge to your AI brain."}
              {addType === 'website' && "Connect a website to learn from its content."}
              {addType === 'file' && "Upload a file to extract knowledge from."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className={`flex-1 ${addType === 'snippet' ? 'bg-white/10' : 'bg-transparent'} border-white/10 text-white`}
                onClick={() => setAddType('snippet')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Text
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${addType === 'website' ? 'bg-white/10' : 'bg-transparent'} border-white/10 text-white`}
                onClick={() => setAddType('website')}
              >
                <Globe className="w-4 h-4 mr-2" />
                Website
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${addType === 'file' ? 'bg-white/10' : 'bg-transparent'} border-white/10 text-white`}
                onClick={() => setAddType('file')}
              >
                <Upload className="w-4 h-4 mr-2" />
                File
              </Button>
            </div>
            
            {addType === 'snippet' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="snippet-name" className="text-white">Title</Label>
                  <Input
                    id="snippet-name"
                    placeholder="E.g., Project Notes, Meeting Summary"
                    className="bg-white/5 border-white/10 text-white"
                    value={snippetName}
                    onChange={(e) => setSnippetName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="snippet-content" className="text-white">Text Content</Label>
                  <Textarea
                    id="snippet-content"
                    placeholder="Enter your text content here..."
                    className="min-h-[150px] bg-white/5 border-white/10 text-white"
                    value={snippetContent}
                    onChange={(e) => setSnippetContent(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {addType === 'website' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url" className="text-white">Website URL</Label>
                  <Input
                    id="website-url"
                    placeholder="https://example.com"
                    className="bg-white/5 border-white/10 text-white"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website-name" className="text-white">Name (Optional)</Label>
                  <Input
                    id="website-name"
                    placeholder="E.g., Company Blog, Research Paper"
                    className="bg-white/5 border-white/10 text-white"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {addType === 'file' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-400 mb-2" />
                  <p className="text-sm text-center text-white mb-2">
                    {selectedFile ? selectedFile.name : "Drag and drop a file here, or click to select"}
                  </p>
                  <p className="text-xs text-center text-purple-300 mb-4">
                    Supports PDF, DOCX, TXT, CSV (max 10MB)
                  </p>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="bg-white/10 hover:bg-white/20 text-white text-sm py-1 px-3 rounded">
                      {selectedFile ? "Change file" : "Select file"}
                    </span>
                    <input 
                      id="file-upload" 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.docx,.txt,.csv"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleAddDialogClose} className="border-white/10 text-white">
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              disabled={
                (addType === 'snippet' && (!snippetName.trim() || !snippetContent.trim())) ||
                (addType === 'website' && !websiteUrl.trim()) ||
                (addType === 'file' && !selectedFile)
              }
              onClick={handleAddItemSubmit}
            >
              Add to Brain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-[#1A0D3A] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedItem?.type === 'snippet' && <FileText className="w-5 h-5 mr-2 text-purple-400" />}
              {selectedItem?.type === 'website' && <Globe className="w-5 h-5 mr-2 text-purple-400" />}
              {selectedItem?.type === 'file' && <FileCode className="w-5 h-5 mr-2 text-purple-400" />}
              {selectedItem?.name}
            </DialogTitle>
            <DialogDescription className="text-purple-300">
              Added on {selectedItem?.date.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedItem?.type === 'snippet' && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 min-h-[200px] whitespace-pre-line">
                {selectedItem?.content}
              </div>
            )}
            
            {selectedItem?.type === 'website' && (
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10">
                  <Link className="w-4 h-4 mr-2 text-purple-400" />
                  <a 
                    href={selectedItem?.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 truncate"
                  >
                    {selectedItem?.url}
                  </a>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 min-h-[150px]">
                  <p className="text-purple-300 italic">
                    In a real implementation, this would display extracted content from the website.
                  </p>
                </div>
              </div>
            )}
            
            {selectedItem?.type === 'file' && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 min-h-[200px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileCode className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-white font-medium">{selectedItem?.name}</p>
                    <p className="text-purple-300 text-sm mt-2">
                      In a real implementation, file content would be processed and displayed here.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between">
            <div>
              <Button 
                variant="outline" 
                size="icon"
                className="border-white/10 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={handleDeleteItem}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-x-2">
              {selectedItem?.type !== 'file' && (
                <Button 
                  variant="outline" 
                  className="border-white/10 text-white"
                  onClick={handleEditItem}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button 
                variant="outline" 
                className="border-white/10 text-white"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1A0D3A] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedItem?.type === 'snippet' && <FileText className="w-5 h-5 mr-2 text-purple-400" />}
              {selectedItem?.type === 'website' && <Globe className="w-5 h-5 mr-2 text-purple-400" />}
              Edit {selectedItem?.type}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedItem?.type === 'snippet' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-snippet-name" className="text-white">Title</Label>
                  <Input
                    id="edit-snippet-name"
                    className="bg-white/5 border-white/10 text-white"
                    value={snippetName}
                    onChange={(e) => setSnippetName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-snippet-content" className="text-white">Text Content</Label>
                  <Textarea
                    id="edit-snippet-content"
                    className="min-h-[150px] bg-white/5 border-white/10 text-white"
                    value={snippetContent}
                    onChange={(e) => setSnippetContent(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {selectedItem?.type === 'website' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-website-url" className="text-white">Website URL</Label>
                  <Input
                    id="edit-website-url"
                    className="bg-white/5 border-white/10 text-white"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-website-name" className="text-white">Name</Label>
                  <Input
                    id="edit-website-name"
                    className="bg-white/5 border-white/10 text-white"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)} 
              className="border-white/10 text-white"
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
              onClick={handleSaveEdit}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BrainAIPage;
