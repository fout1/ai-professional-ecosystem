import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { CheckCircle, Circle } from 'lucide-react';
import aiService from '@/services/aiService';

const Onboarding = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customEmployeeName, setCustomEmployeeName] = useState('');
  const [customEmployeeRole, setCustomEmployeeRole] = useState('');

  const finishOnboarding = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    toast.success('Onboarding complete!');
    
    // Create custom employee if needed
    if (selectedOption === 'custom' && customEmployeeName && customEmployeeRole) {
      aiService.add(
        customEmployeeName,
        customEmployeeRole,
        '/placeholder.svg',
        'bg-gradient-to-r from-purple-500 to-pink-500'
      );
    }
    
    if (selectedOption === 'law') {
      aiService.add(
        'Legal Assistant',
        'Legal Research Expert',
        '/placeholder.svg', 
        'bg-gradient-to-r from-blue-600 to-indigo-700'
      );
    }
    
    navigate('/');
  };

  return (
    <div className="container mx-auto py-12 flex justify-center items-center h-screen">
      <Card className="w-full max-w-md bg-[#1A0D3A] text-white border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Welcome to Your AI Team!</CardTitle>
          <CardDescription className="text-purple-300">
            Let's set up your first AI employee.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Choose a setup option:</h3>
            <RadioGroup onValueChange={setSelectedOption} defaultValue={selectedOption}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" className="peer sr-only" />
                <Label
                  htmlFor="r1"
                  className="cursor-pointer rounded-md border-2 border-muted p-4 shadow-sm data-[state=checked]:border-primary data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center">
                    {selectedOption === 'default' ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="mr-2 h-4 w-4 text-white/30" />
                    )}
                    Default Setup
                  </div>
                  <p className="text-sm text-muted-foreground text-purple-300">
                    We'll create a general-purpose AI assistant for you.
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="law" id="r2" className="peer sr-only" />
                <Label
                  htmlFor="r2"
                  className="cursor-pointer rounded-md border-2 border-muted p-4 shadow-sm data-[state=checked]:border-primary data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center">
                    {selectedOption === 'law' ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="mr-2 h-4 w-4 text-white/30" />
                    )}
                    Law Specialization
                  </div>
                  <p className="text-sm text-muted-foreground text-purple-300">
                    Set up an AI assistant specialized in legal tasks.
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="r3" className="peer sr-only" />
                <Label
                  htmlFor="r3"
                  className="cursor-pointer rounded-md border-2 border-muted p-4 shadow-sm data-[state=checked]:border-primary data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center">
                    {selectedOption === 'custom' ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="mr-2 h-4 w-4 text-white/30" />
                    )}
                    Custom Setup
                  </div>
                  <p className="text-sm text-muted-foreground text-purple-300">
                    Create a custom AI assistant with a specific name and role.
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {selectedOption === 'custom' && (
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">AI Employee Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="e.g., Marketing Assistant"
                  className="bg-white/5 border-white/10 text-white"
                  value={customEmployeeName}
                  onChange={(e) => setCustomEmployeeName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">AI Employee Role</Label>
                <Input
                  type="text"
                  id="role"
                  placeholder="e.g., Content Creation Expert"
                  className="bg-white/5 border-white/10 text-white"
                  value={customEmployeeRole}
                  onChange={(e) => setCustomEmployeeRole(e.target.value)}
                />
              </div>
            </div>
          )}

          <Button onClick={finishOnboarding} disabled={!selectedOption} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            Finish Onboarding
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
