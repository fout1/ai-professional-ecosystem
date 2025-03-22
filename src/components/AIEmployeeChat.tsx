
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowLeft, Mic, Paperclip, Image, MoreVertical, ThumbsUp, Copy, Sparkles, UploadCloud, DownloadCloud, FileText, MicOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import aiService from '@/services/aiService';
import { Message } from '@/services/aiService'; // Import Message type correctly
import { getApiKey } from '@/config/apiConfig';

interface AIEmployeeChatProps {
  name: string;
  role: string;
  avatarSrc: string;
  bgColor: string;
  employeeId: string;
  onClose: () => void;
}

const AIEmployeeChat = ({ name, role, avatarSrc, bgColor, employeeId, onClose }: AIEmployeeChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Check if API key is set
  const [apiKeySet, setApiKeySet] = useState(false);
  
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = getApiKey();
      setApiKeySet(!!apiKey);
    };
    
    checkApiKey();
    
    // Check again when component gains focus
    window.addEventListener('focus', checkApiKey);
    return () => {
      window.removeEventListener('focus', checkApiKey);
    };
  }, []);

  // Load conversation history when component mounts
  useEffect(() => {
    // Get conversation history from the service
    const history = aiService.getConversation(employeeId);
    
    // If there's no history, add a welcome message
    if (history.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Hi there! I'm ${name}, your ${role}. How can I assist you today with my specialized knowledge?`,
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages(history);
    }
  }, [employeeId, name, role]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle file uploads
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) ready to be sent`);
    }
  };

  // Handle image uploads
  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      toast.success(`${files.length} image(s) ready to be sent`);
    }
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // In a real implementation, you would send this blob to a speech-to-text service
        // For now, let's simulate with a placeholder message
        setInputValue("I'm sending a voice message...");
        toast.info("Voice recognition would process your audio in a real implementation");
        
        // Clean up the media stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped");
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() && uploadedFiles.length === 0 && uploadedImages.length === 0) return;
    
    if (!apiKeySet) {
      toast.error("Please add your OpenAI API key in Login settings");
      return;
    }
    
    // Prepare the content based on text and attachments
    let content = inputValue;
    
    // Add file information to the message
    if (uploadedFiles.length > 0) {
      content += "\n\n[Files attached: " + uploadedFiles.map(f => f.name).join(", ") + "]";
    }
    
    // Create a user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      attachments: [...uploadedFiles.map(file => ({ type: 'file', name: file.name }))],
      images: [...uploadedImages]
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setUploadedImages([]);
    setIsTyping(true);
    
    try {
      // First, learn from the Brain AI if there's any context
      await aiService.addToKnowledge(employeeId, content);
      
      // Send message to AI service and get response with Brain knowledge context
      const aiResponse = await aiService.send(employeeId, content, {
        files: uploadedFiles,
        images: uploadedImages
      });
      
      // Update messages with AI response
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      toast.error("Failed to get a response. Please try again.");
    }
  };

  const handleNewConversation = () => {
    aiService.clearConversation(employeeId);
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Hi there! I'm ${name}, your ${role}. How can I assist you today with my specialized knowledge?`,
        timestamp: new Date(),
      },
    ]);
    setShowOptions(false);
  };

  const handleExportChat = () => {
    const chatContent = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : name} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-with-${name}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Chat exported successfully");
    setShowOptions(false);
  };

  const handleUploadFile = () => {
    fileInputRef.current?.click();
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
                <button 
                  className="w-full flex items-center text-left px-3 py-2 text-sm rounded hover:bg-white/5 text-white/90"
                  onClick={handleExportChat}
                >
                  <DownloadCloud className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Export chat</span>
                </button>
                <button 
                  className="w-full flex items-center text-left px-3 py-2 text-sm rounded hover:bg-white/5 text-white/90"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                >
                  <UploadCloud className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Upload data</span>
                </button>
                <button 
                  className="w-full flex items-center text-left px-3 py-2 text-sm rounded hover:bg-white/5 text-white/90"
                  onClick={handleNewConversation}
                >
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
                  
                  {/* Display attached images */}
                  {message.images && message.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.images.map((img, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden">
                          <img 
                            src={img} 
                            alt="Attached" 
                            className="w-32 h-32 object-cover border border-white/20" 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Display file attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment, index) => (
                        <div 
                          key={index}
                          className="flex items-center p-1.5 bg-white/5 rounded border border-white/10"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-400 mr-2" />
                          <span className="text-xs truncate">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className={`flex items-center justify-between mt-1 ${
                    message.role === 'user' ? 'text-white/70' : 'text-purple-300'
                  }`}>
                    <p className="text-xs">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      
      {/* File and Image Upload Preview */}
      {(uploadedFiles.length > 0 || uploadedImages.length > 0) && (
        <motion.div 
          className="p-4 bg-white/5 border-t border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex flex-wrap gap-3">
            {uploadedFiles.map((file, index) => (
              <div 
                key={index} 
                className="bg-white/10 border border-white/20 rounded-lg p-2 flex items-center group relative"
              >
                <FileText className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-xs truncate max-w-[100px]">{file.name}</span>
                <button 
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative group">
                <img 
                  src={img} 
                  alt="Upload preview" 
                  className="w-14 h-14 object-cover rounded-lg border border-white/20" 
                />
                <button 
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
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
              onClick={handleUploadFile}
            >
              Select files
            </Button>
            
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              multiple 
              onChange={handleFileSelected} 
            />
          </div>
        </motion.div>
      )}
      
      <div className="p-4 border-t border-white/10 bg-[#150D35]/80 backdrop-blur-sm">
        {!apiKeySet && (
          <div className="mb-3 p-2 bg-yellow-600/20 border border-yellow-600/30 rounded-md text-sm text-yellow-200">
            Please add your OpenAI API key in the Login page to enable chat functionality.
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-center space-x-2 mb-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10 text-purple-300"
              onClick={handleUploadFile}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10 text-purple-300"
              onClick={() => imageInputRef.current?.click()}
            >
              <Image className="h-4 w-4" />
              <input 
                ref={imageInputRef}
                type="file" 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handleImageSelected} 
              />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-full hover:bg-white/10 ${isRecording ? 'text-red-400' : 'text-purple-300'}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex items-start space-x-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={apiKeySet ? `Ask ${name} anything...` : "Add API key to enable chat"}
              className="flex-1 bg-white/5 border-white/10 focus:border-purple-500 text-white placeholder:text-white/50 rounded-xl py-2 min-h-[60px] max-h-[150px]"
              disabled={!apiKeySet}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isTyping || (!inputValue.trim() && uploadedFiles.length === 0 && uploadedImages.length === 0) || !apiKeySet}
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
