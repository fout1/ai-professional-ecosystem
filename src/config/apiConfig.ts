
// This file contains API configuration settings
// IMPORTANT: For production, use environment variables instead of hardcoding

export const OPENAI_CONFIG = {
  model: "gpt-4o", // Using the latest GPT-4o model as requested
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  apiBaseUrl: "https://api.openai.com/v1",
};

// In a production environment, API keys should be stored securely on the server
// For this demo, we're storing it in localStorage after user login
export const storeApiKey = (apiKey: string) => {
  localStorage.setItem('openai_api_key', apiKey);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem('openai_api_key');
};
