/**
 * Google Gemini AI Integration Module
 * 
 * PURPOSE:
 * Provides cost-optimized integration with Google Gemini API for generating
 * predictive analytics insights. Includes caching and request optimization.
 * 
 * COST OPTIMIZATION:
 * - Aggregates data before sending to AI (reduces tokens)
 * - Implements caching to avoid redundant API calls
 * - Uses summary statistics instead of raw data
 */

const https = require('https');

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD1dUGmiSer-rapBfWza_CaicUZyfwYoK0';

// Cache for discovered models (to avoid repeated API calls)
let discoveredModels = null;

// Try multiple model/endpoint combinations as fallback
// Common model names - will be auto-discovered if these fail
const MODEL_CONFIGS = [
  { base: 'https://generativelanguage.googleapis.com/v1beta/models', model: 'gemini-1.5-flash' },
  { base: 'https://generativelanguage.googleapis.com/v1beta/models', model: 'gemini-1.5-pro' },
  { base: 'https://generativelanguage.googleapis.com/v1beta/models', model: 'gemini-pro' },
  { base: 'https://generativelanguage.googleapis.com/v1/models', model: 'gemini-1.5-flash' },
  { base: 'https://generativelanguage.googleapis.com/v1/models', model: 'gemini-1.5-pro' }
];

// Use the first config as default
const GEMINI_API_BASE = MODEL_CONFIGS[0].base;
const GEMINI_MODEL = MODEL_CONFIGS[0].model;

// Simple in-memory cache (can be replaced with Redis for production)
const cache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// API Usage Tracking
const apiUsageStats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  cacheHits: 0,
  lastRequestTime: null,
  requestsByDate: new Map() // Track requests per day
};

/**
 * Generate AI insights using Gemini API
 * 
 * @param {string} prompt - The prompt/question for the AI
 * @param {object} data - Aggregated data to analyze (keep it small!)
 * @param {string} cacheKey - Cache key for this request
 * @returns {Promise<object>} AI insights object
 */
async function generateInsights(prompt, data, cacheKey = null) {
  // Check cache first
  if (cacheKey) {
    const cached = getFromCache(cacheKey);
    if (cached) {
      console.log('✅ Using cached AI response for:', cacheKey);
      apiUsageStats.cacheHits++;
      return cached;
    }
  }

  try {
    console.log('🤖 [GEMINI] Preparing request...');
    // Prepare the content - keep it concise to save tokens
    const dataSummary = JSON.stringify(data, null, 2);
    const fullPrompt = `${prompt}\n\nData Summary:\n${dataSummary}\n\nPlease provide concise, actionable insights (max 3 paragraphs).`;
    
    console.log(`📝 [GEMINI] Prompt length: ${fullPrompt.length} characters`);

    const requestBody = {
      contents: [{
        parts: [{
          text: fullPrompt
        }]
      }]
    };

    console.log('📡 [GEMINI] Making API request...');
    // Track API request
    apiUsageStats.totalRequests++;
    const today = new Date().toISOString().split('T')[0];
    const dailyCount = apiUsageStats.requestsByDate.get(today) || 0;
    apiUsageStats.requestsByDate.set(today, dailyCount + 1);
    apiUsageStats.lastRequestTime = new Date();
    
    // Make API request
    const response = await makeGeminiRequest(requestBody);
    console.log('✅ [GEMINI] API request completed');
    apiUsageStats.successfulRequests++;

    if (response && response.candidates && response.candidates[0]) {
      const insightText = response.candidates[0].content.parts[0].text;
      
      const result = {
        text: insightText,
        model: 'gemini-pro',
        timestamp: new Date().toISOString()
      };

      // Cache the result
      if (cacheKey) {
        saveToCache(cacheKey, result);
      }

      console.log('✅ AI insights generated successfully');
      return result;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);
    apiUsageStats.failedRequests++;
    throw error;
  }
}

/**
 * Make HTTP request to Gemini API
 */
function makeGeminiRequest(requestBody) {
  return new Promise((resolve, reject) => {
    // Try each model/endpoint combination until one works
    tryModelConfig(0, requestBody, resolve, reject);
  });
}

function tryModelConfig(configIndex, requestBody, resolve, reject) {
  if (configIndex >= MODEL_CONFIGS.length) {
    // All predefined models failed - try to discover available models
    console.log('⚠️ [GEMINI] All predefined models failed. Attempting to discover available models...');
    discoverAndTryModels(requestBody, resolve, reject);
    return;
  }

  const config = MODEL_CONFIGS[configIndex];
  const url = `${config.base}/${config.model}:generateContent?key=${GEMINI_API_KEY}`;
  const urlObj = new URL(url);
  
  console.log(`📡 [GEMINI] Trying: ${config.model} at ${config.base.replace('https://generativelanguage.googleapis.com/', '')}`);
  console.log(`📡 [GEMINI] Request URL: ${url.replace(GEMINI_API_KEY, 'KEY_HIDDEN')}`);

  const postData = JSON.stringify(requestBody);

  const options = {
    hostname: urlObj.hostname,
    path: urlObj.pathname + urlObj.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 30000 // 30 second timeout
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        console.log(`📡 [GEMINI] Response status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          const jsonData = JSON.parse(data);
          console.log('✅ [GEMINI] API response received successfully');
          resolve(jsonData);
        } else {
          console.error(`❌ [GEMINI] API error ${res.statusCode} for ${config.model}:`, data.substring(0, 500));
          let errorData;
          try {
            errorData = JSON.parse(data);
          } catch (e) {
            errorData = { error: { message: data } };
          }
          const errorMsg = errorData.error?.message || errorData.message || 'Unknown error';
          
          // If 404 (model not found), try next config or discover models
          if (res.statusCode === 404) {
            if (configIndex + 1 < MODEL_CONFIGS.length) {
              console.log(`⚠️ [GEMINI] Model ${config.model} not found, trying next configuration...`);
              tryModelConfig(configIndex + 1, requestBody, resolve, reject);
              return;
            } else {
              // Last predefined model failed - try to discover available models
              console.log('⚠️ [GEMINI] All predefined models failed. Attempting to discover available models...');
              discoverAndTryModels(requestBody, resolve, reject);
              return;
            }
          }
          
          reject(new Error(`Gemini API error: ${res.statusCode} - ${errorMsg}`));
        }
      } catch (error) {
        console.error('❌ [GEMINI] Failed to parse response:', error.message);
        console.error('❌ [GEMINI] Response data:', data.substring(0, 500));
        reject(new Error(`Failed to parse response: ${error.message}`));
      }
    });
  });

  req.on('error', (error) => {
    reject(new Error(`Request failed: ${error.message}`));
  });

  req.on('timeout', () => {
    req.destroy();
    reject(new Error('Request timeout'));
  });

  req.write(postData);
  req.end();
}

/**
 * Discover available models by calling ListModels API
 */
function discoverAndTryModels(requestBody, resolve, reject) {
  const listEndpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
  ];
  
  let endpointsTried = 0;
  
  function tryListEndpoint(endpointIndex) {
    if (endpointIndex >= listEndpoints.length) {
      reject(new Error('Failed to discover available models. Please check your API key and ensure it has access to Gemini models.'));
      return;
    }
    
    const endpoint = listEndpoints[endpointIndex];
    const urlObj = new URL(endpoint);
    
    console.log(`🔍 [GEMINI] Discovering models from: ${urlObj.pathname}`);
    
    https.get({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const modelsList = JSON.parse(data);
            console.log(`✅ [GEMINI] Found ${modelsList.models?.length || 0} available models`);
            
            if (modelsList.models && modelsList.models.length > 0) {
              // Extract base URL (without query string)
              const baseUrlObj = new URL(endpoint);
              const baseUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}${baseUrlObj.pathname}`;
              
              // Find a model that supports generateContent
              for (const model of modelsList.models) {
                const modelName = model.name.split('/').pop();
                const supportedMethods = model.supportedGenerationMethods || [];
                
                if (supportedMethods.includes('generateContent')) {
                  console.log(`✅ [GEMINI] Found working model: ${modelName}`);
                  // Try this model
                  const config = {
                    base: baseUrl,
                    model: modelName
                  };
                  
                  trySpecificModel(config, requestBody, resolve, reject);
                  return;
                }
              }
              
              // If no model with generateContent found, try the first one anyway
              const firstModel = modelsList.models[0];
              const modelName = firstModel.name.split('/').pop();
              const config = {
                base: baseUrl,
                model: modelName
              };
              
              console.log(`⚠️ [GEMINI] Trying first available model: ${modelName}`);
              trySpecificModel(config, requestBody, resolve, reject);
            } else {
              // Try next endpoint
              tryListEndpoint(endpointIndex + 1);
            }
          } else {
            console.error(`❌ [GEMINI] ListModels failed with status ${res.statusCode}`);
            tryListEndpoint(endpointIndex + 1);
          }
        } catch (error) {
          console.error('❌ [GEMINI] Error parsing models list:', error.message);
          tryListEndpoint(endpointIndex + 1);
        }
      });
    }).on('error', (error) => {
      console.error('❌ [GEMINI] Error listing models:', error.message);
      tryListEndpoint(endpointIndex + 1);
    }).on('timeout', () => {
      console.error('❌ [GEMINI] ListModels timeout');
      tryListEndpoint(endpointIndex + 1);
    });
  }
  
  tryListEndpoint(0);
}

/**
 * Try a specific model configuration
 */
function trySpecificModel(config, requestBody, resolve, reject) {
  const url = `${config.base}/${config.model}:generateContent?key=${GEMINI_API_KEY}`;
  const urlObj = new URL(url);
  
  console.log(`📡 [GEMINI] Trying discovered model: ${config.model}`);
  
  const postData = JSON.stringify(requestBody);
  
  const options = {
    hostname: urlObj.hostname,
    path: urlObj.pathname + urlObj.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 30000
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        if (res.statusCode === 200) {
          const jsonData = JSON.parse(data);
          console.log('✅ [GEMINI] Discovered model worked!');
          resolve(jsonData);
        } else {
          const errorData = JSON.parse(data);
          reject(new Error(`Discovered model failed: ${res.statusCode} - ${errorData.error?.message || 'Unknown error'}`));
        }
      } catch (error) {
        reject(new Error(`Failed to parse response: ${error.message}`));
      }
    });
  });
  
  req.on('error', reject);
  req.on('timeout', () => {
    req.destroy();
    reject(new Error('Request timeout'));
  });
  
  req.write(postData);
  req.end();
}

/**
 * Cache management functions
 */
function saveToCache(key, value) {
  cache.set(key, {
    value: value,
    timestamp: Date.now()
  });
}

function getFromCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;
  if (age > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return cached.value;
}

/**
 * Clear cache (useful for testing or forced refresh)
 */
function clearCache() {
  cache.clear();
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}

/**
 * Get API usage statistics
 */
function getAPIUsageStats() {
  const today = new Date().toISOString().split('T')[0];
  const todayRequests = apiUsageStats.requestsByDate.get(today) || 0;
  
  return {
    totalRequests: apiUsageStats.totalRequests,
    successfulRequests: apiUsageStats.successfulRequests,
    failedRequests: apiUsageStats.failedRequests,
    cacheHits: apiUsageStats.cacheHits,
    lastRequestTime: apiUsageStats.lastRequestTime,
    todayRequests: todayRequests,
    cacheHitRate: apiUsageStats.totalRequests > 0 
      ? ((apiUsageStats.cacheHits / (apiUsageStats.totalRequests + apiUsageStats.cacheHits)) * 100).toFixed(1)
      : 0
  };
}

/**
 * Reset API usage statistics (useful for testing)
 */
function resetAPIUsageStats() {
  apiUsageStats.totalRequests = 0;
  apiUsageStats.successfulRequests = 0;
  apiUsageStats.failedRequests = 0;
  apiUsageStats.cacheHits = 0;
  apiUsageStats.lastRequestTime = null;
  apiUsageStats.requestsByDate.clear();
}

module.exports = {
  generateInsights,
  clearCache,
  getCacheStats,
  getAPIUsageStats,
  resetAPIUsageStats
};
