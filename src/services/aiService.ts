
import { toast } from "sonner";

// Define message interfaces
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Professional environment types
export type EnvironmentType = 'law' | 'accounting' | 'architecture' | 'engineering' | 'custom';

// AI Employee type definition
export interface AIEmployee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  trainingData?: string; // Additional context for this AI Employee
  environmentType: EnvironmentType;
}

// Conversation history store
class ConversationStore {
  private conversations: Record<string, Message[]> = {};

  getConversation(employeeId: string): Message[] {
    if (!this.conversations[employeeId]) {
      this.conversations[employeeId] = [];
    }
    return this.conversations[employeeId];
  }

  addMessage(employeeId: string, message: Message): void {
    if (!this.conversations[employeeId]) {
      this.conversations[employeeId] = [];
    }
    this.conversations[employeeId].push(message);
    // Save to localStorage for persistence
    localStorage.setItem(`conversation_${employeeId}`, JSON.stringify(this.conversations[employeeId]));
  }

  loadConversation(employeeId: string): void {
    const savedConversation = localStorage.getItem(`conversation_${employeeId}`);
    if (savedConversation) {
      try {
        const parsedConversation = JSON.parse(savedConversation);
        // Convert string timestamps back to Date objects
        this.conversations[employeeId] = parsedConversation.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (error) {
        console.error("Error loading conversation:", error);
        this.conversations[employeeId] = [];
      }
    }
  }

  clearConversation(employeeId: string): void {
    this.conversations[employeeId] = [];
    localStorage.removeItem(`conversation_${employeeId}`);
  }
}

// Singleton instance
const conversationStore = new ConversationStore();

// AI Employees storage
class AIEmployeeStore {
  private employees: AIEmployee[] = [];
  private environmentName: string = '';
  private environmentColor: string = '';
  private environmentType: EnvironmentType = 'custom';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedEmployees = localStorage.getItem('aiEmployees');
    const storedEnvironmentName = localStorage.getItem('environmentName');
    const storedEnvironmentColor = localStorage.getItem('environmentColor');
    const storedEnvironmentType = localStorage.getItem('environmentType');

    if (storedEmployees) {
      this.employees = JSON.parse(storedEmployees);
    }
    
    if (storedEnvironmentName) {
      this.environmentName = storedEnvironmentName;
    }
    
    if (storedEnvironmentColor) {
      this.environmentColor = storedEnvironmentColor;
    }

    if (storedEnvironmentType) {
      this.environmentType = storedEnvironmentType as EnvironmentType;
    }
  }

  private saveToStorage() {
    localStorage.setItem('aiEmployees', JSON.stringify(this.employees));
    localStorage.setItem('environmentName', this.environmentName);
    localStorage.setItem('environmentColor', this.environmentColor);
    localStorage.setItem('environmentType', this.environmentType);
  }

  getEnvironmentInfo() {
    return {
      name: this.environmentName,
      color: this.environmentColor,
      type: this.environmentType
    };
  }

  setEnvironmentInfo(name: string, color: string, type: EnvironmentType) {
    this.environmentName = name;
    this.environmentColor = color;
    this.environmentType = type;
    this.saveToStorage();
  }

  getEmployees(): AIEmployee[] {
    return this.employees;
  }

  setEmployees(employees: AIEmployee[]) {
    this.employees = employees;
    this.saveToStorage();
  }

  addEmployee(employee: AIEmployee) {
    this.employees.push(employee);
    this.saveToStorage();
    return employee;
  }

  getEmployeeById(id: string): AIEmployee | undefined {
    return this.employees.find(emp => emp.id === id);
  }

  updateEmployee(id: string, updates: Partial<AIEmployee>) {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...updates };
      this.saveToStorage();
      return this.employees[index];
    }
    return undefined;
  }

  removeEmployee(id: string) {
    this.employees = this.employees.filter(emp => emp.id !== id);
    this.saveToStorage();
  }

  generateDefaultEmployees(type: EnvironmentType): AIEmployee[] {
    const employees: AIEmployee[] = [];

    switch (type) {
      case 'law':
        employees.push(
          {
            id: crypto.randomUUID(),
            name: 'Legal Research',
            role: 'Legal Research',
            avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png',
            color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
            trainingData: 'You are a specialized AI for legal research. You have knowledge of case law, statutes, regulations, and legal precedents.',
            environmentType: 'law'
          },
          {
            id: crypto.randomUUID(),
            name: 'Contract Drafter',
            role: 'Contract Drafter',
            avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png',
            color: 'bg-gradient-to-br from-violet-500 to-purple-600',
            trainingData: 'You are a specialized AI for drafting and analyzing legal contracts. You understand contract law, common clauses, and best practices.',
            environmentType: 'law'
          },
          {
            id: crypto.randomUUID(),
            name: 'Document Analyzer',
            role: 'Document Analyzer',
            avatar: '/lovable-uploads/bda55609-a29a-4f13-a7ec-1aa2dd23bc93.png',
            color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
            trainingData: 'You are a specialized AI for analyzing legal documents. You can extract key information, identify risks, and suggest improvements.',
            environmentType: 'law'
          }
        );
        break;
      
      case 'accounting':
        employees.push(
          {
            id: crypto.randomUUID(),
            name: 'Accountant',
            role: 'Accountant',
            avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png',
            color: 'bg-gradient-to-br from-green-500 to-emerald-600',
            trainingData: 'You are a specialized AI for accounting. You understand financial statements, accounting principles, and tax regulations.',
            environmentType: 'accounting'
          },
          {
            id: crypto.randomUUID(),
            name: 'Tax Specialist',
            role: 'Tax Specialist',
            avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png',
            color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
            trainingData: 'You are a specialized AI for tax planning and compliance. You understand tax laws, deductions, and filing requirements.',
            environmentType: 'accounting'
          },
          {
            id: crypto.randomUUID(),
            name: 'Invoice Manager',
            role: 'Invoice Manager',
            avatar: '/lovable-uploads/570c8aab-bc26-4753-949a-c6c23830ffc5.png',
            color: 'bg-gradient-to-br from-amber-500 to-orange-600',
            trainingData: 'You are a specialized AI for managing invoices. You can help track, organize, and process invoices and payments.',
            environmentType: 'accounting'
          }
        );
        break;
      
      case 'architecture':
        employees.push(
          {
            id: crypto.randomUUID(),
            name: 'Rendering Expert',
            role: 'Rendering Expert',
            avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png',
            color: 'bg-gradient-to-br from-rose-500 to-pink-600',
            trainingData: 'You are a specialized AI for architectural rendering. You understand 3D visualization, lighting, materials, and presentation techniques.',
            environmentType: 'architecture'
          },
          {
            id: crypto.randomUUID(),
            name: 'Design Assistant',
            role: 'Design Assistant',
            avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png',
            color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
            trainingData: 'You are a specialized AI for architectural design. You understand design principles, building codes, and sustainable design practices.',
            environmentType: 'architecture'
          },
          {
            id: crypto.randomUUID(),
            name: 'Project Manager',
            role: 'Project Manager',
            avatar: '/lovable-uploads/0897d41e-5a79-425f-a800-0527c6dff105.png',
            color: 'bg-gradient-to-br from-amber-500 to-orange-600',
            trainingData: 'You are a specialized AI for architectural project management. You understand timelines, budgets, resource allocation, and client communication.',
            environmentType: 'architecture'
          }
        );
        break;
      
      case 'engineering':
        employees.push(
          {
            id: crypto.randomUUID(),
            name: 'Simulation Expert',
            role: 'Simulation Expert',
            avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png',
            color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
            trainingData: 'You are a specialized AI for engineering simulations. You understand physics, materials, and computational methods for simulating real-world phenomena.',
            environmentType: 'engineering'
          },
          {
            id: crypto.randomUUID(),
            name: 'Structural Engineer',
            role: 'Structural Engineer',
            avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png',
            color: 'bg-gradient-to-br from-gray-700 to-gray-900',
            trainingData: 'You are a specialized AI for structural engineering. You understand load calculations, material properties, and building safety requirements.',
            environmentType: 'engineering'
          },
          {
            id: crypto.randomUUID(),
            name: 'Project Reporter',
            role: 'Project Reporter',
            avatar: '/lovable-uploads/5ff2a73b-e899-4ad0-bf0b-a3313f5f8b2c.png',
            color: 'bg-gradient-to-br from-amber-500 to-orange-600',
            trainingData: 'You are a specialized AI for engineering project reporting. You can help create comprehensive, accurate technical reports and presentations.',
            environmentType: 'engineering'
          }
        );
        break;
        
      default:
        employees.push(
          {
            id: crypto.randomUUID(),
            name: 'Assistant',
            role: 'General Assistant',
            avatar: '/placeholder.svg',
            color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
            trainingData: 'You are a general AI assistant. You can help with a variety of tasks and provide information across different domains.',
            environmentType: 'custom'
          }
        );
    }
    
    this.setEmployees(employees);
    return employees;
  }
}

// Singleton instance
const aiEmployeeStore = new AIEmployeeStore();

// AI Service for chat functionality
class AIService {
  private store = conversationStore;
  private employeeStore = aiEmployeeStore;

  constructor() {
    // Initialize if needed
  }

  // Load conversation history
  getConversationHistory(employeeId: string): Message[] {
    this.store.loadConversation(employeeId);
    return this.store.getConversation(employeeId);
  }

  // Send a message to an AI Employee and get a response
  async sendMessage(employeeId: string, content: string): Promise<Message> {
    const employee = this.employeeStore.getEmployeeById(employeeId);
    
    if (!employee) {
      throw new Error("AI Employee not found");
    }
    
    // Add user message to history
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    this.store.addMessage(employeeId, userMessage);
    
    // Generate AI response based on employee role and training data
    try {
      // In a real app, this would be an API call to a language model
      // For now, we'll use a simulated response
      const responseContent = await this.generateResponse(employee, content);
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      this.store.addMessage(employeeId, aiResponse);
      return aiResponse;
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error("Failed to generate response. Please try again.");
      throw error;
    }
  }

  // Simulated AI response generation
  private async generateResponse(employee: AIEmployee, content: string): Promise<string> {
    // In a real app, this would call OpenAI or another LLM
    // For now, we'll use predefined responses based on employee role
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    switch (employee.role) {
      case 'Legal Research':
        return `Based on my legal research database, I can help with that. The relevant cases include Smith v. Jones (2018) and Walker v. Thompson (2020). These cases established important precedents for this type of situation. Would you like me to provide more detailed analysis?`;
      
      case 'Contract Drafter':
        return `I've drafted over 5,000 contracts of this type. I can customize a template for you with all the necessary clauses and legal protections. Would you like me to start with a standard agreement or something more specialized? I can also review any existing contracts you have.`;
      
      case 'Document Analyzer':
        return `I've analyzed your document and found several key clauses that may need revision. Section 3.2 contains potentially ambiguous language, and the liability limitations in Section 7 might not be enforceable in some jurisdictions. Would you like me to suggest specific revisions?`;
      
      case 'Accountant':
        return `I've reviewed the financial data you provided. Your current ratio is 1.5, which indicates good short-term financial health. However, your inventory turnover ratio is below industry average. Would you like me to prepare a more detailed analysis of your liquidity metrics and suggest improvements?`;
      
      case 'Tax Specialist':
        return `Based on your business structure and revenue streams, I've identified several potential tax deductions you may be eligible for. This could reduce your tax liability by approximately 15-20%. I can draft a detailed tax strategy report if you'd like to explore these options further.`;
      
      case 'Invoice Manager':
        return `I've processed your invoicing data. You currently have 12 outstanding invoices totaling $24,750. The oldest invoice is 45 days overdue. Would you like me to generate automated reminders for clients with payments over 30 days late and suggest a collection strategy?`;
      
      case 'Rendering Expert':
        return `I can create photorealistic 3D renderings of your architectural plans. Would you prefer interior or exterior visualizations first? I can also generate different lighting scenarios to showcase the design at different times of day and with various material finishes.`;
      
      case 'Design Assistant':
        return `Based on your project requirements, I'd recommend considering these sustainable materials for the eastern facade. They provide excellent thermal performance while meeting your aesthetic goals. I can create a detailed specification document including suppliers and cost estimates.`;
      
      case 'Project Manager':
        return `I've updated your project timeline. The critical path now shows potential delays in the foundation phase. Would you like me to suggest resource reallocations to maintain the target completion date? I can also generate a contingency plan to address potential risks.`;
      
      case 'Simulation Expert':
        return `I've run the simulation with the parameters you provided. The results indicate a 92% efficiency rating, which exceeds industry standards. The stress analysis shows all components within safe operating limits. I can generate a detailed report with visualization of all critical points.`;
      
      case 'Structural Engineer':
        return `The structural analysis is complete. All load-bearing elements meet safety requirements with a safety factor of 1.8. I'd recommend increasing the column dimensions in the northeast corner for optimal performance. I can provide detailed calculations and specifications for the contractor.`;
      
      case 'Project Reporter':
        return `I've generated a comprehensive project report. Key metrics show an on-time completion rate of 87% and resource utilization at 91%. Would you like me to prepare an executive summary for your stakeholder meeting, including visualizations of the most important data points?`;
      
      default:
        return `I understand your request. Let me work on that for you. Based on my analysis, there are several approaches we could take. Would you like me to proceed with the most efficient solution or would you prefer I explain all the options in detail first?`;
    }
  }

  // Clear conversation history
  clearConversation(employeeId: string): void {
    this.store.clearConversation(employeeId);
    toast.success("Conversation history cleared");
  }

  // Get all AI Employees
  getAIEmployees(): AIEmployee[] {
    return this.employeeStore.getEmployees();
  }

  // Get environment information
  getEnvironmentInfo() {
    return this.employeeStore.getEnvironmentInfo();
  }

  // Set environment information and generate default employees
  setEnvironment(name: string, color: string, type: EnvironmentType): AIEmployee[] {
    this.employeeStore.setEnvironmentInfo(name, color, type);
    return this.employeeStore.generateDefaultEmployees(type);
  }

  // Add a custom AI Employee
  addCustomEmployee(name: string, role: string, avatar: string = '/placeholder.svg', color: string = 'bg-gradient-to-br from-indigo-500 to-blue-600'): AIEmployee {
    const { type } = this.employeeStore.getEnvironmentInfo();
    
    const newEmployee: AIEmployee = {
      id: crypto.randomUUID(),
      name,
      role,
      avatar,
      color,
      environmentType: type,
      trainingData: `You are a specialized AI for ${role}. You assist users with tasks related to ${role}.`
    };
    
    return this.employeeStore.addEmployee(newEmployee);
  }

  // Get an AI Employee by ID
  getEmployeeById(id: string): AIEmployee | undefined {
    return this.employeeStore.getEmployeeById(id);
  }
}

// Create a singleton instance
const aiService = new AIService();

export default aiService;
