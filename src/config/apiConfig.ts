
// This file contains API configuration settings

export const OPENAI_CONFIG = {
  model: "gpt-4o", // Using the latest GPT-4o model
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  apiBaseUrl: "https://api.openai.com/v1",
  apiKey: "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"
};

// Helper function to check if API key is available
export const hasApiKey = (): boolean => {
  return true; // Always return true since we're hardcoding the API key
};

// Getter function to retrieve the API key
export const getApiKey = (): string => {
  return OPENAI_CONFIG.apiKey;
};
