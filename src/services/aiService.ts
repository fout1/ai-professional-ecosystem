import { toast } from "sonner";
import { OPENAI_CONFIG, getApiKey } from "@/config/apiConfig";

// Define message interfaces
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: { type: string, name: string }[];
  images?: string[];
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
  specialties?: string[]; // Topics this employee specializes in
}

// Brain AI knowledge item
export interface BrainItem {
  id: string;
  type: 'snippet' | 'website' | 'file';
  content: string;
  title: string;
  date: Date;
  userId: string;
  employeeId?: string; // Optional link to specific employee
  fileUrl?: string;
  fileType?: string;
}

// Conversation Store
class ConversationStore {
  private conversations: { [employeeId: string]: Message[] } = {};
  private localStorageKey = 'conversations';

  constructor() {
    this.loadConversations();
  }

  // Load conversations from local storage
  loadConversations() {
    try {
      const storedConversations = localStorage.getItem(this.localStorageKey);
      if (storedConversations) {
        this.conversations = JSON.parse(storedConversations);
      }
    } catch (error) {
      console.error("Error loading conversations from local storage:", error);
    }
  }

  // Save conversations to local storage
  saveConversations() {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.conversations));
    } catch (error) {
      console.error("Error saving conversations to local storage:", error);
    }
  }

  getConversation(employeeId: string): Message[] {
    return this.conversations[employeeId] || [];
  }

  addMessage(employeeId: string, message: Message): void {
    if (!this.conversations[employeeId]) {
      this.conversations[employeeId] = [];
    }
    this.conversations[employeeId].push(message);
    this.saveConversations();
  }

  clearConversation(employeeId: string): void {
    this.conversations[employeeId] = [];
    this.saveConversations();
  }

  loadConversation(employeeId: string): void {
    if (!this.conversations[employeeId]) {
      this.conversations[employeeId] = [];
      this.saveConversations();
    }
  }
}

// Brain Store
class BrainStore {
  private brainItems: BrainItem[] = [];
  private localStorageKey = 'brainItems';

  constructor() {
    this.loadItems();
  }

  // Load items from local storage
  loadItems() {
    try {
      const storedItems = localStorage.getItem(this.localStorageKey);
      if (storedItems) {
        this.brainItems = JSON.parse(storedItems);
      }
    } catch (error) {
      console.error("Error loading brain items from local storage:", error);
    }
  }

  // Save items to local storage
  saveItems() {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.brainItems));
    } catch (error) {
      console.error("Error saving brain items to local storage:", error);
    }
  }

  getItems(userId: string, type?: 'snippet' | 'website' | 'file'): BrainItem[] {
    let items = this.brainItems.filter(item => item.userId === userId);
    if (type) {
      items = items.filter(item => item.type === type);
    }
    return items;
  }

  addItem(item: Omit<BrainItem, 'id'>): BrainItem {
    const newItem: BrainItem = {
      id: crypto.randomUUID(),
      ...item
    };
    this.brainItems.push(newItem);
    this.saveItems();
    return newItem;
  }

  updateItem(id: string, updates: Partial<BrainItem>): BrainItem | undefined {
    const index = this.brainItems.findIndex(item => item.id === id);
    if (index !== -1) {
      this.brainItems[index] = { ...this.brainItems[index], ...updates };
      this.saveItems();
      return this.brainItems[index];
    }
    return undefined;
  }

  deleteItem(id: string): void {
    this.brainItems = this.brainItems.filter(item => item.id !== id);
    this.saveItems();
  }

  searchItems(userId: string, query: string): BrainItem[] {
    const searchTerm = query.toLowerCase();
    return this.brainItems.filter(item =>
      item.userId === userId && (item.title.toLowerCase().includes(searchTerm) || item.content.toLowerCase().includes(searchTerm))
    );
  }
}

// AI Employee Store
class AIEmployeeStore {
  private employees: AIEmployee[] = [];
  private localStorageKey = 'aiEmployees';
  private environmentInfo: { name: string; color: string; type: EnvironmentType } = {
    name: 'Default',
    color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    type: 'custom'
  };
  private environmentLocalStorageKey = 'environmentInfo';

  constructor() {
    this.loadEmployees();
    this.loadEnvironmentInfo();
  }

  // Load employees from local storage
  loadEmployees() {
    try {
      const storedEmployees = localStorage.getItem(this.localStorageKey);
      if (storedEmployees) {
        this.employees = JSON.parse(storedEmployees);
      } else {
        // If no employees are stored, generate default employees
        this.generateDefaultEmployees(this.environmentInfo.type);
      }
    } catch (error) {
      console.error("Error loading AI employees from local storage:", error);
    }
  }

  // Save employees to local storage
  saveEmployees() {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.employees));
    } catch (error) {
      console.error("Error saving AI employees to local storage:", error);
    }
  }

  // Load environment info from local storage
  loadEnvironmentInfo() {
    try {
      const storedEnvironmentInfo = localStorage.getItem(this.environmentLocalStorageKey);
      if (storedEnvironmentInfo) {
        this.environmentInfo = JSON.parse(storedEnvironmentInfo);
      }
    } catch (error) {
      console.error("Error loading environment info from local storage:", error);
    }
  }

  // Save environment info to local storage
  saveEnvironmentInfo() {
    try {
      localStorage.setItem(this.environmentLocalStorageKey, JSON.stringify(this.environmentInfo));
    } catch (error) {
      console.error("Error saving environment info to local storage:", error);
    }
  }

  getEmployees(): AIEmployee[] {
    return this.employees;
  }

  getEmployeeById(id: string): AIEmployee | undefined {
    return this.employees.find(employee => employee.id === id);
  }

  addEmployee(employee: AIEmployee): AIEmployee {
    this.employees.push(employee);
    this.saveEmployees();
    return employee;
  }

  updateEmployee(id: string, updates: Partial<AIEmployee>): AIEmployee | undefined {
    const index = this.employees.findIndex(employee => employee.id === id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...updates };
      this.saveEmployees();
      return this.employees[index];
    }
    return undefined;
  }

  removeEmployee(id: string): void {
    this.employees = this.employees.filter(employee => employee.id !== id);
    this.saveEmployees();
  }

  getEnvironmentInfo() {
    return this.environmentInfo;
  }

  setEnvironmentInfo(name: string, color: string, type: EnvironmentType) {
    this.environmentInfo = { name, color, type };
    this.saveEnvironmentInfo();
  }

  generateDefaultEmployees(type: EnvironmentType): AIEmployee[] {
    if (this.employees.length > 0) {
      return this.employees; // Prevent overriding existing employees
    }

    let defaultEmployees: AIEmployee[] = [];

    switch (type) {
      case 'law':
        defaultEmployees = [
          {
            id: crypto.randomUUID(),
            name: 'Legal Assistant',
            role: 'Legal Research Expert',
            avatar: '/placeholder.svg',
            color: 'bg-gradient-to-r from-blue-600 to-indigo-700',
            environmentType: type,
            trainingData: 'You are a legal assistant specializing in legal research. Provide accurate and up-to-date information on legal topics.'
          },
          {
            id: crypto.randomUUID(),
            name: 'Paralegal AI',
            role: 'Document Review Specialist',
            avatar: '/placeholder.svg',
            color: 'bg-gradient-to-r from-blue-400 to-purple-500',
            environmentType: type,
            trainingData: 'You are a paralegal AI specializing in document review. Assist in organizing and summarizing legal documents.'
          }
        ];
        break;
      case 'accounting':
        defaultEmployees = [
          {
            id: crypto.randomUUID(),
            name: 'Accounting Assistant',
            role: 'Financial Data Analyst',
            avatar: '/placeholder.svg',
            color: 'bg-gradient-to-r from-green-600 to-teal-500',
            environmentType: type,
            trainingData: 'You are an accounting assistant specializing in financial data analysis. Provide insights and reports on financial data.'
          },
          {
            id: crypto.randomUUID(),
            name: 'Tax Advisor AI',
            role: 'Tax Compliance Specialist',
            avatar: '/placeholder.svg',
            color: 'bg-gradient-to-r from-green-400 to-lime-500',
            environmentType: type,
            trainingData: 'You are a tax advisor AI specializing in tax compliance. Assist in understanding and complying with tax regulations.'
          }
        ];
        break;
      case 'architecture':
        defaultEmployees = [
          {
            id: crypto.randomUUID(),
            name: 'Architectural Assistant',
            role: 'Design Visualization Expert',
            avatar: '/placeholder.svg',
            color: 'bg-gradient-to-r from-orange-600 to-amber-500',
            environmentType: type,
            trainingData: 'You are an architectural assistant specializing in design visualization. Create visual representations of architectural designs.'
          },
          {
            id: crypto.randomUUID(),
            name: 'Urban Planner AI',
            role: 'Sustainable Design Specialist',
            avatar: '/placeholder.svg',
            color: 'bg-gradient-to-r from-orange-400 to-yellow-500',
            environmentType: type,
            trainingData: 'You are an urban planner AI specializing in sustainable design. Assist in planning sustainable and eco-friendly urban spaces.'
          }
        ];
        break;
      case 'engineering':
        defaultEmployees = [
          {
            id: crypto.randomUUID(),
            name: 'Engineering Assistant',
            role: 'Structural Analysis Expert',
            avatar: '/placeholder.svg',
            color: 'bg-gradient-to-r from-red-600 to-rose-500',
            environmentType: type,
            trainingData: 'You are an engineering assistant specializing in structural analysis. Provide analysis and recommendations for structural designs.'
          },
          {
            id: crypto.randomUUID(),
            name: 'Civil Engineer AI',
            role: 'Infrastructure Planning Specialist',
            avatar: '/placeholder.svg',
            color: 'bg-gradient-to-r from-red-400 to-pink-500',
            environmentType: type,
            trainingData: 'You are a civil engineer AI specializing in infrastructure planning. Assist in planning and designing infrastructure projects.'
          }
        ];
        break;
      default:
        defaultEmployees = [];
        break;
    }

    this.employees = defaultEmployees;
    this.saveEmployees();
    return this.employees;
  }
}

// Topic Analyzer (Placeholder)
class TopicAnalyzer {
  async analyzeTopic(text: string): Promise<string[]> {
    // In a real implementation, this would use an NLP service to analyze the text
    // and extract relevant topics or keywords.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    return ['example topic 1', 'example topic 2'];
  }
}

// Create instances of stores and services
const conversationStore = new ConversationStore();
const brainStore = new BrainStore();
const aiEmployeeStore = new AIEmployeeStore();
const topicAnalyzer = new TopicAnalyzer();

// AI Service for chat functionality
class AIService {
  private store = conversationStore;
  private employeeStore = aiEmployeeStore;
  private brainStore = brainStore;
  private analyzer = topicAnalyzer;

  // Expose conversation store methods
  getConversation(employeeId: string): Message[] {
    this.store.loadConversation(employeeId);
    return this.store.getConversation(employeeId);
  }

  clearConversation(employeeId: string): void {
    this.store.clearConversation(employeeId);
  }

  // Expose brain store methods
  getBrainItems(userId: string, type?: 'snippet' | 'website' | 'file'): BrainItem[] {
    return this.brainStore.getItems(userId, type);
  }

  addBrainItem(item: Omit<BrainItem, 'id'>): BrainItem {
    return this.brainStore.addItem(item);
  }

  updateBrainItem(id: string, updates: Partial<BrainItem>): BrainItem | undefined {
    return this.brainStore.updateItem(id, updates);
  }

  deleteBrainItem(id: string): void {
    return this.brainStore.deleteItem(id);
  }

  searchBrainItems(userId: string, query: string): BrainItem[] {
    return this.brainStore.searchItems(userId, query);
  }

  // Add knowledge to the Brain AI from conversations
  async addToKnowledge(employeeId: string, content: string): Promise<void> {
    try {
      // Extract useful information from the conversation
      if (content.length > 20) { // Minimum size to consider adding to knowledge base
        const employee = this.employeeStore.getEmployeeById(employeeId);
        if (!employee) return;
        
        // Create a snippet from the conversation
        this.brainStore.addItem({
          type: 'snippet',
          content: content,
          title: `Chat with ${employee.name}: ${content.substring(0, 30)}...`,
          date: new Date(),
          userId: 'current-user', // In a real app, this would be the actual user ID
          employeeId: employeeId
        });
      }
    } catch (error) {
      console.error("Error adding to brain knowledge:", error);
    }
  }

  // Send a message to an AI Employee and get a response
  async send(employeeId: string, content: string, attachments?: {
    files?: File[], 
    images?: string[]
  }): Promise<Message> {
    const employee = this.employeeStore.getEmployeeById(employeeId);
    
    if (!employee) {
      throw new Error("AI Employee not found");
    }
    
    // Add user message to history
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      attachments: attachments?.files?.map(file => ({ type: 'file', name: file.name })),
      images: attachments?.images
    };
    
    this.store.addMessage(employeeId, userMessage);
    
    try {
      // Get the API key
      const apiKey = getApiKey();
      
      if (!apiKey) {
        throw new Error("OpenAI API key not found. Please add your API key in the settings.");
      }
      
      // Retrieve conversation history for context
      const conversationHistory = this.store.getConversation(employeeId)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Get relevant brain knowledge for this employee
      const brainKnowledge = this.getBrainKnowledgeForEmployee(employeeId);
      
      // Prepare the system message with employee training data and brain knowledge
      let systemPrompt = employee.trainingData || `You are ${employee.name}, a specialized AI for ${employee.role}.`;
      
      // Add brain knowledge to the system prompt if available
      if (brainKnowledge) {
        systemPrompt += `\n\nKnowledge Base: ${brainKnowledge}`;
      }
      
      const systemMessage = {
        role: "system",
        content: systemPrompt
      };
      
      // Call the OpenAI API
      const responseContent = await this.callOpenAI([
        systemMessage,
        ...conversationHistory.slice(-10) // Use last 10 messages for context
      ]);
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      this.store.addMessage(employeeId, aiResponse);
      
      // Learn from this interaction
      await this.addToKnowledge(employeeId, `Q: ${content}\nA: ${responseContent}`);
      
      return aiResponse;
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate response. Please try again.");
      
      // Use fallback response in case of API failure
      const fallbackResponse = this.getFallbackResponse(employee);
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };
      
      this.store.addMessage(employeeId, aiResponse);
      return aiResponse;
    }
  }

  // Expose employee store methods
  getEmployees(): AIEmployee[] {
    return this.employeeStore.getEmployees();
  }

  getEnvironmentInfo() {
    return this.employeeStore.getEnvironmentInfo();
  }

  setEnvironment(name: string, color: string, type: EnvironmentType): AIEmployee[] {
    this.employeeStore.setEnvironmentInfo(name, color, type);
    return this.employeeStore.generateDefaultEmployees(type);
  }

  add(name: string, role: string, avatar: string = '/placeholder.svg', color: string = 'bg-gradient-to-br from-indigo-500 to-blue-600'): AIEmployee {
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

  addWithSpecialties(
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

  update(id: string, updates: Partial<AIEmployee>): AIEmployee | undefined {
    return this.employeeStore.updateEmployee(id, updates);
  }

  remove(id: string): void {
    this.employeeStore.removeEmployee(id);
  }

  private getBrainKnowledgeForEmployee(employeeId: string): string | null {
    const knowledgeItems = this.brainStore.getItems('current-user')
      .filter(item => item.employeeId === employeeId)
      .map(item => item.content);
    
    if (knowledgeItems.length === 0) {
      return null;
    }
    
    return knowledgeItems.join('\n\n');
  }

  private async callOpenAI(messages: { role: string; content: string }[]): Promise<string> {
    try {
      const apiKey = getApiKey();
      
      if (!apiKey) {
        throw new Error("OpenAI API key not found. Please add your API key in the settings.");
      }
      
      const response = await fetch(OPENAI_CONFIG.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.model,
          messages: messages,
          max_tokens: OPENAI_CONFIG.max_tokens,
          temperature: OPENAI_CONFIG.temperature,
        }),
      });
      
      if (!response.ok) {
        const errorBody = await response.json();
        console.error("OpenAI API Error:", errorBody);
        throw new Error(`OpenAI API Error: ${response.status} - ${errorBody.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      return content;
    } catch (error: any) {
      console.error("Error calling OpenAI API:", error);
      throw new Error(`Failed to call OpenAI API: ${error.message || 'Unknown error'}`);
    }
  }

  private getFallbackResponse(employee: AIEmployee): string {
    return `I'm currently experiencing issues connecting to the AI service. Please try again later. In the meantime, I can assist you with basic information about ${employee.role}.`;
  }

  // Add a method to find the best employee for a question
  findBestEmployeeForQuestion(question: string): AIEmployee | null {
    const employees = this.employeeStore.getEmployees();
    if (employees.length === 0) return null;
    
    // For now, just return a random employee
    // In a real implementation, this would analyze the question and match it with employee specialties
    return employees[Math.floor(Math.random() * employees.length)];
  }

  // Alias method for backward compatibility
  getAIEmployees(): AIEmployee[] {
    return this.getEmployees();
  }

  // Alias method for backward compatibility
  getEmployeeById(id: string): AIEmployee | undefined {
    return this.getEmployees().find(emp => emp.id === id);
  }

  // Alias method for backward compatibility
  addCustomEmployeeWithSpecialties(
    name: string, 
    role: string, 
    avatar: string = '/placeholder.svg', 
    color: string = 'bg-gradient-to-br from-indigo-500 to-blue-600',
    specialties: string[] = []
  ): AIEmployee {
    return this.addWithSpecialties(name, role, avatar, color, specialties);
  }
}

// Create and export a singleton instance
const aiService = new AIService();
export default aiService;
