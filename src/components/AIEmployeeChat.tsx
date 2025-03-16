
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default welcome message from the AI
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hi there! I'm ${name}, your ${role}. How can I assist you today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [name, role]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          responseContent = `Based on my legal research database, I can help with that. The relevant cases include Smith v. Jones (2018) and Walker v. Thompson (2020). Would you like me to provide more detailed analysis?`;
          break;
        case 'Contract Drafter':
          responseContent = `I've drafted over 5,000 contracts of this type. I can customize a template for you with all the necessary clauses and legal protections. Would you like me to start with a standard agreement or something more specialized?`;
          break;
        case 'Document Analyzer':
          responseContent = `I've analyzed your document and found several key clauses that may need revision. Section 3.2 contains potentially ambiguous language, and the liability limitations in Section 7 might not be enforceable in some jurisdictions.`;
          break;
        case 'Accountant':
          responseContent = `I've reviewed the financial data you provided. Your current ratio is 1.5, which indicates good short-term financial health. Would you like me to prepare a more detailed analysis of your liquidity metrics?`;
          break;
        case 'Tax Specialist':
          responseContent = `Based on your business structure and revenue streams, I've identified several potential tax deductions you may be eligible for. This could reduce your tax liability by approximately 15-20%.`;
          break;
        case 'Invoice Manager':
          responseContent = `I've processed your invoicing data. You currently have 12 outstanding invoices totaling $24,750. Would you like me to generate automated reminders for clients with payments over 30 days late?`;
          break;
        case 'Rendering Expert':
          responseContent = `I can create photorealistic 3D renderings of your architectural plans. Would you prefer interior or exterior visualizations first? I can also generate different lighting scenarios to showcase the design at different times of day.`;
          break;
        case 'Design Assistant':
          responseContent = `Based on your project requirements, I'd recommend considering these sustainable materials for the eastern facade. They provide excellent thermal performance while meeting your aesthetic goals.`;
          break;
        case 'Project Manager':
          responseContent = `I've updated your project timeline. The critical path now shows potential delays in the foundation phase. Would you like me to suggest resource reallocations to maintain the target completion date?`;
          break;
        case 'Simulation Expert':
          responseContent = `I've run the simulation with the parameters you provided. The results indicate a 92% efficiency rating, which exceeds industry standards. The stress analysis shows all components within safe operating limits.`;
          break;
        case 'Structural Engineer':
          responseContent = `The structural analysis is complete. All load-bearing elements meet safety requirements with a safety factor of 1.8. I'd recommend increasing the column dimensions in the northeast corner for optimal performance.`;
          break;
        case 'Project Reporter':
          responseContent = `I've generated a comprehensive project report. Key metrics show an on-time completion rate of 87% and resource utilization at 91%. Would you like me to prepare an executive summary for your stakeholder meeting?`;
          break;
        default:
          responseContent = `I understand your request. Let me work on that for you. Is there anything specific you'd like me to focus on?`;
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
    <div className="flex flex-col h-full">
      <div className={`p-4 flex items-center ${bgColor} text-white`}>
        <button 
          onClick={onClose}
          className="mr-3 hover:bg-white/10 p-1 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img 
          src={avatarSrc || "/placeholder.svg"} 
          alt={`${name} avatar`} 
          className="w-10 h-10 rounded-full mr-3 object-cover" 
        />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-white/70">{role}</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-brand-purple text-white' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isTyping || !inputValue.trim()}
            className={`rounded-full ${bgColor}`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIEmployeeChat;
