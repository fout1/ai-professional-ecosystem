
// API configuration
const API_BASE_URL = 'https://api.openai.com/v1';

// We're temporarily storing the API key in the frontend
// WARNING: This is not secure and should be replaced with a Supabase backend
// This key should be regenerated for security reasons
const DEFAULT_API_KEY = '';  // Removed process.env reference which isn't available in browser

export const apiConfig = {
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DEFAULT_API_KEY}`
  }
};

// This function gets the API key (from localStorage if available)
export const getApiKey = () => {
  const storedKey = localStorage.getItem('openai_api_key');
  if (storedKey) {
    return storedKey;
  }
  return DEFAULT_API_KEY;
};

// Check if an API key is available
export const hasApiKey = () => {
  const key = getApiKey();
  return !!key && key.trim() !== '';
};

// Store API key in localStorage
export const storeApiKey = (key: string) => {
  localStorage.setItem('openai_api_key', key);
};

// OpenAI configuration
export const OPENAI_CONFIG = {
  model: "gpt-4o", // Using GPT-4o as a high-quality available model
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  apiBaseUrl: "https://api.openai.com/v1"
};
