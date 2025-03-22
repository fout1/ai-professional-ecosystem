import { BehaviorSubject } from 'rxjs';

// Define interfaces
export interface AIEmployee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  environmentType: string;
  specialties: string[];
  trainingData: string;
}

export interface BrainItem {
  id: string;
  type: 'snippet' | 'website' | 'file';
  title: string;
  content: string;
  date: Date;
  userId: string;
}

interface EnvironmentInfo {
  type: string;
  color: string;
}

// Conversation store
class ConversationStore {
  private conversations: { [employeeId: string]: string[] } = {};

  getConversation(employeeId: string): string[] {
    return this.conversations[employeeId] || [];
  }

  addMessage(employeeId: string, message: string): void {
    if (!this.conversations[employeeId]) {
      this.conversations[employeeId] = [];
    }
    this.conversations[employeeId].push(message);
  }
}

// Brain store
class BrainStore {
  private brainItems: BrainItem[] = [];

  getItems(userId: string, type?: 'snippet' | 'website' | 'file'): BrainItem[] {
    return this.brainItems.filter(item => item.userId === userId && (!type || item.type === type));
  }

  addItem(item: Omit<BrainItem, 'id'>): BrainItem {
    const newItem: BrainItem = {
      id: crypto.randomUUID(),
      ...item,
      date: new Date()
    };
    this.brainItems.push(newItem);
    return newItem;
  }
}

// AI Employee store
class AIEmployeeStore {
  private employees: AIEmployee[] = [];
  private environmentInfo: EnvironmentInfo;

  constructor() {
    const storedEnvironment = localStorage.getItem('environmentName');
    const storedColor = localStorage.getItem('environmentColor');
    
    this.environmentInfo = {
      type: storedEnvironment || 'Professional',
      color: storedColor || 'bg-gradient-to-br from-indigo-500 to-blue-600'
    };
  }

  getEnvironmentInfo(): EnvironmentInfo {
    return this.environmentInfo;
  }

  setEnvironmentInfo(type: string, color: string): void {
    this.environmentInfo = { type, color };
    localStorage.setItem('environmentName', type);
    localStorage.setItem('environmentColor', color);
  }

  getEmployees(): AIEmployee[] {
    return this.employees;
  }

  addEmployee(employee: AIEmployee): AIEmployee {
    this.employees.push(employee);
    return employee;
  }

  addCustomEmployeeWithSpecialties(
    name: string, 
    role: string, 
    avatar: string = '/placeholder.svg', 
    color: string = 'bg-gradient-to-br from-indigo-500 to-blue-600',
    specialties: string[] = []
  ): AIEmployee {
    const { type } = this.getEnvironmentInfo();
    
    const newEmployee: AIEmployee = {
      id: crypto.randomUUID(),
      name,
      role,
      avatar,
      color,
      environmentType: type,
      specialties: specialties,
      trainingData: `You are a specialized AI for ${role} named ${name}. You assist users with tasks related to ${role}. ${specialties.length > 0 ? `You have expertise in: ${specialties.join(', ')}.` : ''}`
    };
    
    return this.addEmployee(newEmployee);
  }

  getEmployeeById(id: string): AIEmployee | undefined {
    return this.employees.find(employee => employee.id === id);
  }
}

// Topic analyzer (Dummy implementation)
class TopicAnalyzer {
  findBestEmployee(employees: AIEmployee[], question: string): AIEmployee | null {
    // Basic logic to determine the best employee based on keywords
    const questionLower = question.toLowerCase();

    // Prioritize employees with matching specialties
    for (const employee of employees) {
      if (employee.specialties && employee.specialties.some(specialty => questionLower.includes(specialty.toLowerCase()))) {
        return employee;
      }
    }

    // Fallback to role-based matching
    for (const employee of employees) {
      if (questionLower.includes(employee.role.toLowerCase())) {
        return employee;
      }
    }

    // If no match is found, return a default employee or null
    return employees.length > 0 ? employees[0] : null;
  }
}

const topicAnalyzer = new TopicAnalyzer();

// AI service class
class AIService {
  employeeStore: AIEmployeeStore;
  conversationStore: ConversationStore;
  brainStore: BrainStore;
  analyzer: TopicAnalyzer;

  constructor() {
    this.employeeStore = new AIEmployeeStore();
    this.conversationStore = new ConversationStore();
    this.brainStore = new BrainStore();
    this.analyzer = topicAnalyzer;
  }

  // Environment management
  getEnvironmentInfo(): EnvironmentInfo {
    return this.employeeStore.getEnvironmentInfo();
  }

  setEnvironmentInfo(type: string, color: string): void {
    this.employeeStore.setEnvironmentInfo(type, color);
  }

  // AI Employee management
  getAIEmployees(): AIEmployee[] {
    return this.employeeStore.getEmployees();
  }

  addEmployee(employee: AIEmployee): AIEmployee {
    return this.employeeStore.addEmployee(employee);
  }

  addCustomEmployeeWithSpecialties(
    name: string, 
    role: string, 
    avatar: string = '/placeholder.svg', 
    color: string = 'bg-gradient-to-br from-indigo-500 to-blue-600',
    specialties: string[] = []
  ): AIEmployee {
    const { type } = this.employeeStore.getEnvironmentInfo();
    
    const newEmployee: AIEmployee = {
      id: crypto.randomUUID(),
      name,
      role,
      avatar,
      color,
      environmentType: type,
      specialties: specialties,
      trainingData: `You are a specialized AI for ${role} named ${name}. You assist users with tasks related to ${role}. ${specialties.length > 0 ? `You have expertise in: ${specialties.join(', ')}.` : ''}`
    };
    
    return this.employeeStore.addEmployee(newEmployee);
  }

  // Get employee by ID
  getEmployeeById(id: string): AIEmployee | undefined {
    return this.employeeStore.getEmployeeById(id);
  }

  // Find best AI Employee for a question
  findBestEmployeeForQuestion(question: string): AIEmployee | null {
    const employees = this.getAIEmployees();
    return this.analyzer.findBestEmployee(employees, question);
  }

  // Brain knowledge management
  getBrainItems(userId: string, type?: 'snippet' | 'website' | 'file'): BrainItem[] {
    return this.brainStore.getItems(userId, type);
  }

  addBrainItem(item: Omit<BrainItem, 'id'>): BrainItem {
    return this.brainStore.addItem(item);
  }
}

// Create and export a singleton instance
const aiService = new AIService();
export default aiService;
