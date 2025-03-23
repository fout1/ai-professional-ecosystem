import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import aiService, { AIEmployee as AIEmployeeType } from '@/services/aiService';

const AIEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<AIEmployeeType[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<AIEmployeeType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [employeeSpecialties, setEmployeeSpecialties] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('bg-gradient-to-r from-blue-500 to-purple-500');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const [analysisText, setAnalysisText] = useState('');
  
  const availableSpecialties = [
    'Content Creation',
    'SEO Optimization',
    'Data Analysis',
    'Market Research',
    'Customer Support',
    'Social Media Management',
    'Email Marketing',
    'Web Development',
    'Graphic Design',
    'Project Management'
  ];
  
  const colors = [
    'bg-gradient-to-r from-blue-500 to-purple-500',
    'bg-gradient-to-r from-green-500 to-teal-500',
    'bg-gradient-to-r from-pink-500 to-red-500',
    'bg-gradient-to-r from-yellow-500 to-orange-500',
    'bg-gradient-to-r from-purple-500 to-indigo-500',
    'bg-gradient-to-r from-teal-500 to-blue-500',
    'bg-gradient-to-r from-red-500 to-pink-500',
    'bg-gradient-to-r from-orange-500 to-yellow-500',
  ];

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadEmployees();
  }, [navigate]);
  
  const loadEmployees = () => {
    const employees = aiService.getEmployees();
    setEmployees(employees);
  };

  const handleOpenAddDialog = () => {
    setEmployeeName('');
    setEmployeeRole('');
    setSelectedSpecialties([]);
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleAddEmployee = () => {
    // Check if all required fields are filled
    if (!employeeName || !employeeRole || !selectedSpecialties.length) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      // Add the employee
      const newEmployee = aiService.add(
        employeeName,
        employeeRole,
        '/placeholder.svg',
        selectedColor,
        selectedSpecialties
      );
      
      setEmployees([...employees, newEmployee]);
      toast.success(`${employeeName} added successfully!`);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee");
    }
  };

  const handleOpenEditDialog = (employee: AIEmployeeType) => {
    setSelectedEmployee(employee);
    setEmployeeName(employee.name);
    setEmployeeRole(employee.role);
    setSelectedSpecialties(employee.specialties || []);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleEditEmployee = () => {
    if (!selectedEmployee) return;
    
    try {
      const updatedEmployee = {
        ...selectedEmployee,
        name: employeeName,
        role: employeeRole,
        specialties: selectedSpecialties
      };
      
      aiService.updateEmployee(updatedEmployee);
      
      setEmployees(aiService.getEmployees());
      toast.success(`${employeeName} updated successfully!`);
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Error updating employee");
    }
  };

  const handleOpenDeleteDialog = (employee: AIEmployeeType) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;
    
    try {
      aiService.deleteEmployee(selectedEmployee.id);
      setEmployees(aiService.getEmployees());
      toast.success(`${selectedEmployee.name} deleted successfully!`);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error deleting employee");
    }
  };

  const handleEmployeeClick = (employeeId: string) => {
    const employee = aiService.getEmployeeById(employeeId);
    
    if (employee) {
      setSelectedEmployee(employee);
    } else {
      toast.error("Employee not found");
    }
  };

  const handleAnalyzeText = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee to analyze with");
      return;
    }
    
    if (!analysisText.trim()) {
      toast.error("Please enter text to analyze");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult('');
    setAnalysisError('');
    
    try {
      const result = await aiService.analyzeWithAI(analysisText, selectedEmployee.role);
      setAnalysisResult(result.analysis);
    } catch (error: any) {
      setAnalysisError(error.message || "Failed to analyze text");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">AI Employees</h1>
          <Button onClick={handleOpenAddDialog} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map(employee => (
            <Card key={employee.id} className="bg-[#1A0D3A] text-white border-white/10 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => handleEmployeeClick(employee.id)}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold">{employee.name}</CardTitle>
                    <CardDescription className="text-purple-300">{employee.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {employee.specialties && employee.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {employee.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedEmployee && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Employee Details</h2>
              <Card className="bg-[#1A0D3A] text-white border-white/10">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={selectedEmployee.avatar} />
                      <AvatarFallback>{selectedEmployee.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold">{selectedEmployee.name}</CardTitle>
                      <CardDescription className="text-purple-300">{selectedEmployee.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedEmployee.specialties && selectedEmployee.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedEmployee.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white" onClick={() => handleOpenEditDialog(selectedEmployee)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteDialog(selectedEmployee)} className="bg-red-500 hover:bg-red-600 text-white">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Analyze Text</h2>
              <Card className="bg-[#1A0D3A] text-white border-white/10">
                <CardHeader>
                  <CardTitle>Enter Text for Analysis</CardTitle>
                  <CardDescription className="text-purple-300">Analyze text using the AI employee's expertise.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Textarea 
                    placeholder="Enter text here..." 
                    className="bg-white/5 border-white/10 text-white"
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                  />
                  <Button onClick={handleAnalyzeText} disabled={isAnalyzing} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    {isAnalyzing ? "Analyzing..." : "Analyze"}
                  </Button>
                  {analysisResult && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">Analysis Result:</h3>
                      <p className="text-purple-300">{analysisResult}</p>
                    </div>
                  )}
                  {analysisError && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-red-500">Error:</h3>
                      <p className="text-red-400">{analysisError}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Employee</Button>
        </DialogTrigger>
        <DialogContent className="bg-[#0F0224] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Add AI Employee</DialogTitle>
            <DialogDescription>
              Create a new AI employee with specific skills and expertise.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="col-span-3 bg-white/5 border-white/10 text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input id="role" value={employeeRole} onChange={(e) => setEmployeeRole(e.target.value)} className="col-span-3 bg-white/5 border-white/10 text-white" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="specialties" className="text-right mt-2">
                Specialties
              </Label>
              <div className="col-span-3 space-y-2">
                <ScrollArea className="h-40 w-full rounded-md border border-white/10 p-4">
                  {availableSpecialties.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={`specialty-${specialty}`}
                        checked={selectedSpecialties.includes(specialty)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSpecialties([...selectedSpecialties, specialty]);
                          } else {
                            setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty));
                          }
                        }}
                        className="data-[state=checked]:bg-purple-600 border-gray-600"
                      />
                      <Label htmlFor={`specialty-${specialty}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <div className="col-span-3 flex space-x-2">
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer ${color} ${selectedColor === color ? 'ring-2 ring-white' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddEmployee} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#0F0224] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Edit AI Employee</DialogTitle>
            <DialogDescription>
              Edit the details of the selected AI employee.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="col-span-3 bg-white/5 border-white/10 text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input id="role" value={employeeRole} onChange={(e) => setEmployeeRole(e.target.value)} className="col-span-3 bg-white/5 border-white/10 text-white" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="specialties" className="text-right mt-2">
                Specialties
              </Label>
              <div className="col-span-3 space-y-2">
                <ScrollArea className="h-40 w-full rounded-md border border-white/10 p-4">
                  {availableSpecialties.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={`specialty-${specialty}`}
                        checked={selectedSpecialties.includes(specialty)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSpecialties([...selectedSpecialties, specialty]);
                          } else {
                            setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty));
                          }
                        }}
                        className="data-[state=checked]:bg-purple-600 border-gray-600"
                      />
                      <Label htmlFor={`specialty-${specialty}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditEmployee} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              Update Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Employee Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#0F0224] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Delete AI Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" onClick={handleDeleteEmployee}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AIEmployees;

