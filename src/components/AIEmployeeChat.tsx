
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft, Mic, Paperclip, Image, MoreVertical, ThumbsUp, Copy, Sparkles, UploadCloud, DownloadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIEmployeeChatProps {
  name: string;
  role: string;
  avatarSrc: string;
  bgColor: string;
  onClose: () => void;
}

const AIEmployeeChat = ({ name, role, avatarSrc, bgColor, onClose }: AIEmployeeChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Default welcome message from the AI
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hi there! I'm ${name}, your ${role}. How can I assist you today with my specialized knowledge?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [name, role]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      // Generate AI response based on role
      let responseContent = '';
      
      switch (role) {
        case 'Legal Research':
          responseContent = `Based on my legal research database, I can help with that. The relevant cases include Smith v. Jones (2018) and Walker v. Thompson (2020). These cases established important precedents for this type of situation. Would you like me to provide more detailed analysis?`;
          break;
        case 'Contract Drafter':
          responseContent = `I've drafted over 5,000 contracts of this type. I can customize a template for you with all the necessary clauses and legal protections. Would you like me to start with a standard agreement or something more specialized? I can also review any existing contracts you have.`;
          break;
        case 'Document Analyzer':
          responseContent = `I've analyzed your document and found several key clauses that may need revision. Section 3.2 contains potentially ambiguous language, and the liability limitations in Section 7 might not be enforceable in some jurisdictions. Would you like me to suggest specific revisions?`;
          break;
        case 'Accountant':
          responseContent = `I've reviewed the financial data you provided. Your current ratio is 1.5, which indicates good short-term financial health. However, your inventory turnover ratio is below industry average. Would you like me to prepare a more detailed analysis of your liquidity metrics and suggest improvements?`;
          break;
        case 'Tax Specialist':
          responseContent = `Based on your business structure and revenue streams, I've identified several potential tax deductions you may be eligible for. This could reduce your tax liability by approximately 15-20%. I can draft a detailed tax strategy report if you'd like to explore these options further.`;
          break;
        case 'Invoice Manager':
          responseContent = `I've processed your invoicing data. You currently have 12 outstanding invoices totaling $24,750. The oldest invoice is 45 days overdue. Would you like me to generate automated reminders for clients with payments over 30 days late and suggest a collection strategy?`;
          break;
        case 'Rendering Expert':
          responseContent = `I can create photorealistic 3D renderings of your architectural plans. Would you prefer interior or exterior visualizations first? I can also generate different lighting scenarios to showcase the design at different times of day and with various material finishes.`;
          break;
        case 'Design Assistant':
          responseContent = `Based on your project requirements, I'd recommend considering these sustainable materials for the eastern facade. They provide excellent thermal performance while meeting your aesthetic goals. I can create a detailed specification document including suppliers and cost estimates.`;
          break;
        case 'Project Manager':
          responseContent = `I've updated your project timeline. The critical path now shows potential delays in the foundation phase. Would you like me to suggest resource reallocations to maintain the target completion date? I can also generate a contingency plan to address potential risks.`;
          break;
        case 'Simulation Expert':
          responseContent = `I've run the simulation with the parameters you provided. The results indicate a 92% efficiency rating, which exceeds industry standards. The stress analysis shows all components within safe operating limits. I can generate a detailed report with visualization of all critical points.`;
          break;
        case 'Structural Engineer':
          responseContent = `The structural analysis is complete. All load-bearing elements meet safety requirements with a safety factor of 1.8. I'd recommend increasing the column dimensions in the northeast corner for optimal performance. I can provide detailed calculations and specifications for the contractor.`;
          break;
        case 'Project Reporter':
          responseContent = `I've generated a comprehensive project report. Key metrics show an on-time completion rate of 87% and resource utilization at 91%. Would you like me to prepare an executive summary for your stakeholder meeting, including visualizations of the most important data points?`;
          break;
        default:
          responseContent = `I understand your request. Let me work on that for you. Based on my analysis, there are several approaches we could take. Would you like me to proceed with the most efficient solution or would you prefer I explain all the options in detail first?`;
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#150D35] to-[#1D1148] text-white">
      <div className={`p-4 flex items-center bg-gradient-to-r ${bgColor} text-white relative z-10`}>
        <button 
          onClick={onClose}
          className="mr-3 hover:bg-white/10 p-1 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img 
          src={avatarSrc || "/placeholder.svg"} 
          alt={`${name} avatar`} 
          className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white/30" 
        />
        <div className="flex-1">
          <h3 className="font-semibold">{name}</h3>
          <div className="flex items-center">
            <p className="text-sm text-white/70">{role}</p>
            <span className="ml-2 w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            <span className="ml-1 text-xs text-white/70">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 hover:bg-white/10 text-white"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          
          {showOptions && (
            <div className="absolute right-4 top-16 w-48 bg-[#1A0D3A] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-1">
                <button className="w-full flex items-center text-left px-3 py-2 text-sm rounded hover:bg-white/5 text-white/90">
                  <DownloadCloud className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Export chat</span>
                </button>
                <button className="w-full flex items-center text-left px-3 py-2 text-sm rounded hover:bg-white/5 text-white/90">
                  <UploadCloud className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Import data</span>
                </button>
                <button className="w-full flex items-center text-left px-3 py-2 text-sm rounded hover:bg-white/5 text-white/90">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                  <span>New conversation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl group ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                      : 'bg-white/5 border border-white/10 backdrop-blur-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className={`flex items-center justify-between mt-1 ${
                    message.role === 'user' ? 'text-white/70' : 'text-purple-300'
                  }`}>
                    <p className="text-xs">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    
                    {message.role === 'assistant' && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <button 
                          onClick={() => handleCopyMessage(message.content)}
                          className="p-1 rounded hover:bg-white/10"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button className="p-1 rounded hover:bg-white/10">
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {showImageUpload && (
        <motion.div 
          className="p-4 bg-white/5 border-t border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center">
            <UploadCloud className="w-8 h-8 text-purple-400 mb-2" />
            <p className="text-sm text-center text-white mb-2">Drag and drop files here, or click to select files</p>
            <p className="text-xs text-center text-purple-300 mb-4">Supports PDF, DOCX, PNG, JPG (max 10MB)</p>
            <Button 
              size="sm" 
              className="bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setShowImageUpload(false)}
            >
              Select files
            </Button>
          </div>
        </motion.div>
      )}
      
      <div className="p-4 border-t border-white/10 bg-[#150D35]/80 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-center space-x-2 mb-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10 text-purple-300"
              onClick={() => setShowImageUpload(!showImageUpload)}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10 text-purple-300"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10 text-purple-300"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask ${name} anything...`}
              className="flex-1 bg-white/5 border-white/10 focus:border-purple-500 text-white placeholder:text-white/50 rounded-full py-5"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isTyping || !inputValue.trim()}
              className={`rounded-full bg-gradient-to-r ${bgColor} hover:opacity-90 transition-opacity`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIEmployeeChat;
