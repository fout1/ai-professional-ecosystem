import { v4 as uuidv4 } from 'uuid';

export interface AIEmployee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  specialties?: string[];
}

export interface BrainItem {
  id: string;
  type: 'snippet' | 'website' | 'file';
  title: string;
  content: string;
  date: Date;
  userId: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const aiService = {
  add: (name: string, role: string, avatar: string, color: string, specialties?: string[]): AIEmployee => {
    const newEmployee: AIEmployee = {
      id: uuidv4(),
      name,
      role,
      avatar,
      color,
      specialties: specialties || []
    };

    const existingEmployees = aiService.getEmployees();
    localStorage.setItem('aiEmployees', JSON.stringify([...existingEmployees, newEmployee]));
    return newEmployee;
  },

  getEmployees: (): AIEmployee[] => {
    const employees = localStorage.getItem('aiEmployees');
    return employees ? JSON.parse(employees) : [];
  },

  getEmployeeById: (id: string): AIEmployee | undefined => {
    const employees = aiService.getEmployees();
    return employees.find(employee => employee.id === id);
  },

  updateEmployee: (id: string, updates: Partial<AIEmployee>): AIEmployee | undefined => {
    const employees = aiService.getEmployees().map(employee =>
      employee.id === id ? { ...employee, ...updates } : employee
    );
    localStorage.setItem('aiEmployees', JSON.stringify(employees));
    return aiService.getEmployeeById(id);
  },

  deleteEmployee: (id: string): void => {
    const employees = aiService.getEmployees().filter(employee => employee.id !== id);
    localStorage.setItem('aiEmployees', JSON.stringify(employees));
  },

  findBestEmployeeForQuestion: (question: string): AIEmployee | undefined => {
    const employees = aiService.getEmployees();
    if (employees.length === 0) return undefined;

    // Simple logic to determine which employee might be best suited
    const questionLower = question.toLowerCase();
    let bestEmployee = employees[0]; // Default to first employee

    employees.forEach(emp => {
      const roleLower = emp.role.toLowerCase();
      if (questionLower.includes(roleLower)) {
        bestEmployee = emp;
      }
    });

    return bestEmployee;
  },

  addBrainItem: (item: Omit<BrainItem, 'id'>): BrainItem => {
    const newItem: BrainItem = {
      id: uuidv4(),
      ...item,
      date: new Date()
    };

    const existingItems = aiService.getBrainItems(item.userId);
    localStorage.setItem(`brainItems-${item.userId}`, JSON.stringify([...existingItems, newItem]));
    return newItem;
  },

  getBrainItems: (userId: string, type?: 'snippet' | 'website' | 'file'): BrainItem[] => {
    const items = localStorage.getItem(`brainItems-${userId}`);
    let parsedItems: BrainItem[] = items ? JSON.parse(items) : [];

    if (type) {
      parsedItems = parsedItems.filter(item => item.type === type);
    }

    return parsedItems;
  },

  getBrainItemById: (userId: string, id: string): BrainItem | undefined => {
    const items = aiService.getBrainItems(userId);
    return items.find(item => item.id === id);
  },

  updateBrainItem: (userId: string, id: string, updates: Partial<BrainItem>): BrainItem | undefined => {
    const items = aiService.getBrainItems(userId).map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem(`brainItems-${userId}`, JSON.stringify(items));
    return aiService.getBrainItemById(userId, id);
  },

  deleteBrainItem: (userId: string, id: string): void => {
    const items = aiService.getBrainItems(userId).filter(item => item.id !== id);
    localStorage.setItem(`brainItems-${userId}`, JSON.stringify(items));
  },

  addConversationMessage: (employeeId: string, message: Omit<ConversationMessage, 'timestamp'>): ConversationMessage => {
    const newMessage: ConversationMessage = {
      ...message,
      timestamp: new Date()
    };

    const existingConversation = aiService.getConversation(employeeId);
    localStorage.setItem(`conversation-${employeeId}`, JSON.stringify([...existingConversation, newMessage]));
    return newMessage;
  },

  getConversation: (employeeId: string): ConversationMessage[] => {
    const conversation = localStorage.getItem(`conversation-${employeeId}`);
    return conversation ? JSON.parse(conversation) : [];
  },

  clearConversation: (employeeId: string): void => {
    localStorage.removeItem(`conversation-${employeeId}`);
  },

  analyzeWithAI: async (text: string, prompt: string) => {
    const apiKey = 'demo-key'; // Replace with user's OpenAI key in production
    
    const apiConfig = {
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      apiBaseUrl: "https://api.openai.com/v1/chat/completions"
    };
    
    try {
      console.log("Analyzing with AI...", apiConfig.apiBaseUrl);
      
      // In a real implementation, we would make API calls to OpenAI here
      // For demo purposes, we're returning mock data
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        analysis: `AI analysis of "${text.substring(0, 50)}..." - This appears to be about ${prompt}.`,
        tokens: apiConfig.max_tokens / 10
      };
    } catch (error) {
      console.error("Error analyzing with AI:", error);
      throw new Error("Failed to analyze with AI");
    }
  }
};

export default aiService;
