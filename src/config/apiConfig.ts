
// API configuration
const API_BASE_URL = 'https://api.example.com';

// This is a simulated API key for demo purposes
// In a real app, this would be stored securely on the backend
const DEFAULT_API_KEY = 'sk-ai-key-demosimulatedforaiworkspace12345';

export const apiConfig = {
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DEFAULT_API_KEY}`
  }
};

// This function simulates storing the API key
// In a real app, this wouldn't be done on the frontend
export const getApiKey = () => {
  return DEFAULT_API_KEY;
};

// For demo purposes only
export const hasApiKey = () => {
  return true; // Always return true since we're using a default key
};
