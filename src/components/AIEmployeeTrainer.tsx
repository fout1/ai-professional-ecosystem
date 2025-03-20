
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Sparkles, Brain, Bot, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import aiService, { AIEmployee } from '@/services/aiService';

interface AIEmployeeTrainerProps {
  isOpen: boolean;
  onClose: () => void;
  employee: AIEmployee | null;
}

const AIEmployeeTrainer = ({ isOpen, onClose, employee }: AIEmployeeTrainerProps) => {
  const [trainingData, setTrainingData] = useState(employee?.trainingData || '');
  const [name, setName] = useState(employee?.name || '');
  const [role, setRole] = useState(employee?.role || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!employee) return;
    
    setIsLoading(true);
    
    try {
      // Update the employee with new training data
      aiService.updateEmployee(employee.id, {
        name,
        role,
        trainingData
      });
      
      toast.success("AI employee trained successfully!");
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error("Error training AI employee:", error);
      toast.error("Failed to train AI employee");
      setIsLoading(false);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A0D3A] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            Train AI Employee: {employee.name}
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            Customize your AI employee's behavior and knowledge by providing training instructions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          <div className="flex space-x-4 items-center">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: employee.color }}>
              <Bot className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-2 flex-1">
              <div>
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="role" className="text-white">Role</Label>
                <Input 
                  id="role" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="training" className="text-white">Training Instructions</Label>
            <Textarea 
              id="training"
              value={trainingData}
              onChange={(e) => setTrainingData(e.target.value)}
              className="min-h-[200px] bg-white/5 border-white/10 text-white"
              placeholder="Example: You are a marketing specialist who helps create engaging social media content. You have expertise in digital marketing trends and best practices..."
            />
            
            <p className="text-xs text-purple-300 mt-1">
              Describe the AI employee's role, expertise, and how they should respond to user queries.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white flex items-center mb-2">
              <Sparkles className="w-4 h-4 mr-1.5 text-purple-400" />
              Training Tips
            </h3>
            <ul className="text-xs text-purple-300 space-y-1 list-disc pl-5">
              <li>Be specific about the AI's expertise and knowledge areas</li>
              <li>Define the tone and personality you want the AI to exhibit</li>
              <li>Include any specialized vocabulary or industry terms the AI should know</li>
              <li>Specify how the AI should handle questions outside its expertise</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-white/10 text-white">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <motion.div 
                  className="w-4 h-4 border-2 border-white border-opacity-20 border-t-white rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Training...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Training
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIEmployeeTrainer;
