/**
 * Predictive Analytics JavaScript
 * 
 * PURPOSE:
 * Manages the predictive analytics dashboard with AI-powered insights.
 * Includes appointment forecasting, inventory prediction, and health risk analysis.
 * 
 * AI INTEGRATION:
 * Uses Google Gemini API for generating insights (cost-optimized with caching)
 */

// Global variables
let appointmentChart = null;
let inventoryChart = null;
let healthRiskChart = null;
let aiStats = {
  requests: parseInt(localStorage.getItem('aiRequests') || '0'),
  cacheHits: parseInt(localStorage.getItem('aiCacheHits') || '0'),
  lastUsed: localStorage.getItem('aiLastUsed') || 'Never',
  responseTimes: JSON.parse(localStorage.getItem('aiResponseTimes') || '[]')
};

// Initialize page when DOM is ready
$(document).ready(async function() {
  console.log('🚀 Analytics page loaded');
  console.log('📍 Current URL:', window.location.href);
  console.log('🖼️ Is in iframe:', window.self !== window.top);
  console.log('🍪 Cookies:', document.cookie || 'No cookies visible');
  
  updateAIStats(); // Initialize AI stats display
  
  // Check session first - only load analytics if session is valid
  const sessionValid = await debugSession();
  if (sessionValid) {
    console.log('✅ Session validated, loading analytics...');
    loadAllAnalytics();
  } else {
    console.error('❌ Session invalid, not loading analytics');
    showAIStatus('error', 'Authentication Required');
  }
});

/**
 * Get session info from parent window (for iframe context)
 */
async function getSessionFromParent() {
  return new Promise((resolve, reject) => {
    if (window.self === window.top) {
      // Not in iframe, can check directly
      resolve(null);
      return;
    }
    
    console.log('🖼️ In iframe - requesting session from parent...');
    
    // Request session from parent
    window.parent.postMessage({ type: 'REQUEST_SESSION' }, '*');
    
    // Listen for response
    const messageHandler = (event) => {
      if (event.data && event.data.type === 'SESSION_RESPONSE') {
        window.removeEventListener('message', messageHandler);
        console.log('✅ Received session from parent:', event.data.session);
        resolve(event.data.session);
      }
    };
    
    window.addEventListener('message', messageHandler);
    
    // Timeout after 2 seconds
    setTimeout(() => {
      window.removeEventListener('message', messageHandler);
      console.warn('⚠️ Timeout waiting for parent session');
      resolve(null);
    }, 2000);
  });
}

/**
 * Debug function to check session state
 * Uses /homepage endpoint which works in iframes
 */
async function debugSession() {
  console.log('🔍 [CLIENT DEBUG] Checking session state...');
  console.log('🔍 [CLIENT DEBUG] Is in iframe:', window.self !== window.top);
  
  try {
    // Use /homepage endpoint which works for session validation
    const response = await fetch('/homepage', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ [CLIENT DEBUG] No session found - 401 Unauthorized');
        showNotification('Please log in to access analytics.', 'danger');
        return false;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ [CLIENT DEBUG] Session found:', { role: data.role, email: data.email });
    
    if (data.role !== 'admin') {
      console.error('❌ [CLIENT DEBUG] Not admin! Role:', data.role);
      showNotification('Admin access required for analytics.', 'warning');
      return false;
    }
    
    console.log('✅ [CLIENT DEBUG] Session valid - admin user');
    return true;
  } catch (error) {
    console.error('❌ [CLIENT DEBUG] Error checking session:', error);
    showNotification('Failed to verify session. Please refresh the page.', 'warning');
    return false;
  }
}

/**
 * Load all analytics data and charts
 */
function loadAllAnalytics() {
  loadAppointmentForecast();
  loadInventoryForecast();
  loadHealthRiskAnalysis();
}

/**
 * Refresh all analytics
 */
function refreshAnalytics() {
  // Clear cached AI insights
  localStorage.removeItem('appointmentAIInsights');
  localStorage.removeItem('inventoryAIInsights');
  localStorage.removeItem('healthRiskAIInsights');
  
  loadAllAnalytics();
  
  // Show notification
  showNotification('Analytics refreshed successfully!', 'success');
}

/**
 * ============================================================================
 * APPOINTMENT DEMAND FORECASTING
 * ============================================================================
 */

async function loadAppointmentForecast() {
  showAIStatus('processing', 'Analyzing appointment data...');
  
  try {
    console.log('🔍 [LOAD DEBUG] Loading appointment forecast...');
    console.log('🔍 [LOAD DEBUG] Cookies being sent:', document.cookie);
    
    const response = await fetch('/analytics/appointment-forecast', {
      method: 'GET',
      credentials: 'include' // This is crucial for session/cookie-based auth
    });
    
    console.log('🔍 [LOAD DEBUG] Response status:', response.status);
    console.log('🔍 [LOAD DEBUG] Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [LOAD DEBUG] Error response:', errorData);
      
      if (response.status === 401) {
        showNotification('Please log in to access analytics.', 'warning');
        showAIStatus('error', 'Authentication Required');
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      renderAppointmentChart(data.data);
      updateLastUpdate('appointmentLastUpdate');
      
      // Check for cached AI insights
      const cachedInsights = localStorage.getItem('appointmentAIInsights');
      if (cachedInsights) {
        displayAppointmentInsights(JSON.parse(cachedInsights), true);
        showAIStatus('ready', 'AI Ready');
      }
    } else {
      console.error('Error loading appointment forecast:', data.message);
      showAIStatus('error', 'Error loading data');
    }
    showAIStatus('ready', 'AI Ready');
  } catch (error) {
    console.error('Error loading appointment forecast:', error);
    showAIStatus('error', 'Error loading data');
  }
}

function renderAppointmentChart(data) {
  const ctx = document.getElementById('appointmentForecastChart');
  if (!ctx) return;
  
  if (appointmentChart) {
    appointmentChart.destroy();
  }
  
  const labels = data.historical.map(d => d.date);
  const historicalData = data.historical.map(d => d.count);
  const forecastData = data.forecast.map(d => d.predicted);
  const forecastLabels = data.forecast.map(d => d.date);
  
  appointmentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...labels, ...forecastLabels],
      datasets: [
        {
          label: 'Historical Appointments',
          data: [...historicalData, ...new Array(forecastLabels.length).fill(null)],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: 'Predicted Demand',
          data: [...new Array(labels.length).fill(null), ...forecastData],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderDash: [5, 5],
          tension: 0.4,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Appointment Demand Forecast (Next 7 Days)'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

async function generateAppointmentInsights(forceRefresh = false) {
  showAIProcessing('Analyzing appointment patterns with AI...');
  showAIStatus('processing', 'AI Analyzing...');
  
  const startTime = Date.now();
  
  // Check cache first (24 hour cache) - skip if force refresh
  const cacheKey = 'appointmentAIInsights';
  if (!forceRefresh) {
    const cached = checkCache(cacheKey, 24);
    if (cached) {
      displayAppointmentInsights(cached, true);
      aiStats.cacheHits++;
      updateAIStats();
      showAIStatus('ready', 'AI Ready (Cached - No API Cost)');
      hideAIProcessing();
      showNotification('💾 Using cached insights (saved API cost). Click "Force Refresh" for fresh analysis.', 'info');
      return;
    }
  } else {
    // Clear cache when force refreshing (both client and server)
    localStorage.removeItem(cacheKey);
    console.log('🔄 Force refreshing - bypassing cache...');
    
    // Clear server-side cache too
    try {
      await fetch('/analytics/clear-ai-cache', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.warn('⚠️ Could not clear server cache:', e);
    }
  }
  
  try {
    const response = await fetch('/analytics/ai/appointment-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // This is crucial for session/cookie-based auth
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    if (responseData.success) {
      const responseTime = Date.now() - startTime;
      recordAIUsage(responseTime);
      
      displayAppointmentInsights(responseData.insights, false);
      saveCache(cacheKey, responseData.insights);
      showAIStatus('ready', 'AI Ready');
      showNotification('✅ Fresh AI insights generated! (This used 1 API call)', 'success');
    } else {
      throw new Error(responseData.message || 'Failed to generate insights');
    }
  } catch (error) {
    console.error('❌ Error generating appointment insights:', error);
    
    // Try to get error details from response
    try {
      const errorResponse = await fetch('/analytics/ai/appointment-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({})
      });
      const errorData = await errorResponse.json();
      console.error('Error details:', errorData);
      
      if (errorData.error) {
        showNotification(`AI Error: ${errorData.error}`, 'danger');
      } else {
        showNotification(`Failed to generate AI insights: ${errorData.message || error.message}`, 'danger');
      }
    } catch (e) {
      showNotification(`Failed to generate AI insights: ${error.message}`, 'danger');
    }
    
    showAIStatus('error', 'AI Error');
  } finally {
    hideAIProcessing();
  }
}

function displayAppointmentInsights(insights, fromCache = false) {
  let text = insights.text;
  if (fromCache) {
    text += ' <br><small class="text-info"><i class="bi bi-info-circle me-1"></i><strong>Note:</strong> These insights are from cache (saved API cost). Click "Force Refresh" to generate fresh insights.</small>';
  } else {
    text += ' <br><small class="text-success"><i class="bi bi-check-circle me-1"></i><strong>Fresh AI Analysis:</strong> Generated just now using Google Gemini AI.</small>';
  }
  $('#appointmentInsightsText').html(text);
  $('#appointmentAIInsights').show();
}

/**
 * ============================================================================
 * INVENTORY REORDER PREDICTION
 * ============================================================================
 */

async function loadInventoryForecast() {
  showAIStatus('processing', 'Analyzing inventory data...');
  
  try {
    const response = await fetch('/analytics/inventory-forecast', {
      method: 'GET',
      credentials: 'include' // This is crucial for session/cookie-based auth
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        showNotification('Please log in to access analytics.', 'warning');
        showAIStatus('error', 'Authentication Required');
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      renderInventoryChart(data.data);
      updateLastUpdate('inventoryLastUpdate');
      
      // Check for cached AI insights
      const cachedInsights = localStorage.getItem('inventoryAIInsights');
      if (cachedInsights) {
        displayInventoryInsights(JSON.parse(cachedInsights), true);
        showAIStatus('ready', 'AI Ready');
      }
    } else {
      console.error('Error loading inventory forecast:', data.message);
      showAIStatus('error', 'Error loading data');
    }
    showAIStatus('ready', 'AI Ready');
  } catch (error) {
    console.error('Error loading inventory forecast:', error);
    showAIStatus('error', 'Error loading data');
  }
}

function renderInventoryChart(data) {
  const ctx = document.getElementById('inventoryForecastChart');
  if (!ctx) return;
  
  if (inventoryChart) {
    inventoryChart.destroy();
  }
  
  const items = data.reorderPredictions.map(d => d.item);
  const currentStock = data.reorderPredictions.map(d => d.currentQuantity);
  const reorderThreshold = data.reorderPredictions.map(d => d.reorderThreshold);
  const daysUntilReorder = data.reorderPredictions.map(d => d.daysUntilReorder);
  
  inventoryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: items.slice(0, 10), // Show top 10 items
      datasets: [
        {
          label: 'Current Stock',
          data: currentStock.slice(0, 10),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Reorder Threshold',
          data: reorderThreshold.slice(0, 10),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Top 10 Items Needing Reorder Soon'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

async function generateInventoryInsights(forceRefresh = false) {
  showAIProcessing('Analyzing inventory patterns with AI...');
  showAIStatus('processing', 'AI Analyzing...');
  
  const startTime = Date.now();
  
  // Check cache first - skip if force refresh
  const cacheKey = 'inventoryAIInsights';
  if (!forceRefresh) {
    const cached = checkCache(cacheKey, 24);
    if (cached) {
      displayInventoryInsights(cached, true);
      aiStats.cacheHits++;
      updateAIStats();
      showAIStatus('ready', 'AI Ready (Cached - No API Cost)');
      hideAIProcessing();
      showNotification('💾 Using cached insights (saved API cost). Click "Force Refresh" for fresh analysis.', 'info');
      return;
    }
  } else {
    // Clear cache when force refreshing (both client and server)
    localStorage.removeItem(cacheKey);
    console.log('🔄 Force refreshing - bypassing cache...');
    
    // Clear server-side cache too
    try {
      await fetch('/analytics/clear-ai-cache', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.warn('⚠️ Could not clear server cache:', e);
    }
  }
  
  try {
    const response = await fetch('/analytics/ai/inventory-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // This is crucial for session/cookie-based auth
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    if (responseData.success) {
      const responseTime = Date.now() - startTime;
      recordAIUsage(responseTime);
      
      displayInventoryInsights(responseData.insights, false);
      saveCache(cacheKey, responseData.insights);
      showAIStatus('ready', 'AI Ready');
      showNotification('✅ Fresh AI insights generated! (This used 1 API call)', 'success');
    } else {
      throw new Error(responseData.message || 'Failed to generate insights');
    }
  } catch (error) {
    console.error('Error generating inventory insights:', error);
    showAIStatus('error', 'AI Error');
    showNotification('Failed to generate AI insights. Please try again.', 'danger');
  } finally {
    hideAIProcessing();
  }
}

function displayInventoryInsights(insights, fromCache = false) {
  const text = fromCache ? insights.text + ' <small class="text-muted">(Cached)</small>' : insights.text;
  $('#inventoryInsightsText').html(text);
  $('#inventoryAIInsights').show();
}

/**
 * ============================================================================
 * PATIENT HEALTH RISK PREDICTION
 * ============================================================================
 */

async function loadHealthRiskAnalysis() {
  showAIStatus('processing', 'Analyzing patient health data...');
  
  try {
    const response = await fetch('/analytics/health-risk-analysis', {
      method: 'GET',
      credentials: 'include' // This is crucial for session/cookie-based auth
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        showNotification('Please log in to access analytics.', 'warning');
        showAIStatus('error', 'Authentication Required');
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      renderHealthRiskChart(data.data);
      updateRiskCounts(data.data.riskDistribution);
      updateLastUpdate('healthRiskLastUpdate');
      
      // Store risk patients data
      window.riskPatientsData = data.data.riskPatients;
      
      // Check for cached AI insights
      const cachedInsights = localStorage.getItem('healthRiskAIInsights');
      if (cachedInsights) {
        displayHealthRiskInsights(JSON.parse(cachedInsights), true);
        showAIStatus('ready', 'AI Ready');
      }
    } else {
      console.error('Error loading health risk analysis:', data.message);
      showAIStatus('error', 'Error loading data');
    }
    showAIStatus('ready', 'AI Ready');
  } catch (error) {
    console.error('Error loading health risk analysis:', error);
    showAIStatus('error', 'Error loading data');
  }
}

function renderHealthRiskChart(data) {
  const ctx = document.getElementById('healthRiskChart');
  if (!ctx) return;
  
  if (healthRiskChart) {
    healthRiskChart.destroy();
  }
  
  const riskDistribution = data.riskDistribution;
  
  healthRiskChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['High Risk', 'Medium Risk', 'Low Risk'],
      datasets: [{
        label: 'Patient Risk Distribution',
        data: [riskDistribution.high, riskDistribution.medium, riskDistribution.low],
        backgroundColor: [
          'rgba(220, 53, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(40, 167, 69, 0.8)'
        ],
        borderColor: [
          'rgb(220, 53, 69)',
          'rgb(255, 193, 7)',
          'rgb(40, 167, 69)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Patient Health Risk Distribution'
        }
      }
    }
  });
}

function updateRiskCounts(distribution) {
  $('#highRiskCount').text(distribution.high || 0);
  $('#mediumRiskCount').text(distribution.medium || 0);
  $('#lowRiskCount').text(distribution.low || 0);
}

let riskTableVisible = false;
function toggleRiskPatientsTable() {
  riskTableVisible = !riskTableVisible;
  
  if (riskTableVisible && window.riskPatientsData) {
    displayRiskPatientsTable(window.riskPatientsData);
    $('#riskPatientsTableContainer').show();
  } else {
    $('#riskPatientsTableContainer').hide();
  }
}

function displayRiskPatientsTable(patients) {
  const tbody = $('#riskPatientsTableBody');
  tbody.empty();
  
  patients.slice(0, 20).forEach(patient => {
    const row = `
      <tr>
        <td>${escapeHtml(patient.name)}</td>
        <td>${patient.age}</td>
        <td><span class="badge ${getRiskBadgeClass(patient.riskLevel)}">${patient.riskLevel}</span></td>
        <td>${escapeHtml(patient.primaryConcern || 'N/A')}</td>
        <td>${patient.lastAppointment || 'Never'}</td>
        <td><small>${escapeHtml(patient.recommendation || 'N/A')}</small></td>
      </tr>
    `;
    tbody.append(row);
  });
}

function getRiskBadgeClass(riskLevel) {
  switch(riskLevel.toLowerCase()) {
    case 'high': return 'bg-danger';
    case 'medium': return 'bg-warning';
    case 'low': return 'bg-success';
    default: return 'bg-secondary';
  }
}

async function generateHealthRiskInsights(forceRefresh = false) {
  showAIProcessing('Analyzing patient health patterns with AI...');
  showAIStatus('processing', 'AI Analyzing...');
  
  const startTime = Date.now();
  
  // Check cache first - skip if force refresh
  const cacheKey = 'healthRiskAIInsights';
  if (!forceRefresh) {
    const cached = checkCache(cacheKey, 24);
    if (cached) {
      displayHealthRiskInsights(cached, true);
      aiStats.cacheHits++;
      updateAIStats();
      showAIStatus('ready', 'AI Ready (Cached - No API Cost)');
      hideAIProcessing();
      showNotification('💾 Using cached insights (saved API cost). Click "Force Refresh" for fresh analysis.', 'info');
      return;
    }
  } else {
    // Clear cache when force refreshing (both client and server)
    localStorage.removeItem(cacheKey);
    console.log('🔄 Force refreshing - bypassing cache...');
    
    // Clear server-side cache too
    try {
      await fetch('/analytics/clear-ai-cache', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.warn('⚠️ Could not clear server cache:', e);
    }
  }
  
  try {
    const response = await fetch('/analytics/ai/health-risk-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // This is crucial for session/cookie-based auth
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    if (responseData.success) {
      const responseTime = Date.now() - startTime;
      recordAIUsage(responseTime);
      
      displayHealthRiskInsights(responseData.insights, false);
      saveCache(cacheKey, responseData.insights);
      showAIStatus('ready', 'AI Ready');
      showNotification('✅ Fresh AI insights generated! (This used 1 API call)', 'success');
    } else {
      throw new Error(responseData.message || 'Failed to generate insights');
    }
  } catch (error) {
    console.error('Error generating health risk insights:', error);
    showAIStatus('error', 'AI Error');
    showNotification('Failed to generate AI insights. Please try again.', 'danger');
  } finally {
    hideAIProcessing();
  }
}

function displayHealthRiskInsights(insights, fromCache = false) {
  let text = insights.text;
  if (fromCache) {
    text += ' <br><small class="text-info"><i class="bi bi-info-circle me-1"></i><strong>Note:</strong> These insights are from cache (saved API cost). Click "Force Refresh" to generate fresh insights.</small>';
  } else {
    text += ' <br><small class="text-success"><i class="bi bi-check-circle me-1"></i><strong>Fresh AI Analysis:</strong> Generated just now using Google Gemini AI.</small>';
  }
  $('#healthRiskInsightsText').html(text);
  $('#healthRiskAIInsights').show();
}

/**
 * ============================================================================
 * AI STATUS AND UTILITIES
 * ============================================================================
 */

function showAIStatus(status, text) {
  const indicator = $('#aiStatusIndicator');
  const statusText = $('#aiStatusText');
  
  indicator.removeClass('processing error');
  
  if (status === 'processing') {
    indicator.addClass('processing');
    statusText.text(text);
  } else if (status === 'error') {
    indicator.addClass('error');
    statusText.text(text);
  } else {
    indicator.removeClass('processing error');
    statusText.text(text);
  }
}

function showAIProcessing(text) {
  $('#aiProcessingText').text(text);
  $('#aiProcessingBanner').removeClass('d-none');
}

function hideAIProcessing() {
  $('#aiProcessingBanner').addClass('d-none');
}

function updateLastUpdate(elementId) {
  const now = new Date();
  const timeStr = now.toLocaleString();
  $(`#${elementId}`).text(timeStr);
}

function recordAIUsage(responseTime) {
  aiStats.requests++;
  aiStats.lastUsed = new Date().toISOString();
  aiStats.responseTimes.push(responseTime);
  
  // Keep only last 50 response times
  if (aiStats.responseTimes.length > 50) {
    aiStats.responseTimes = aiStats.responseTimes.slice(-50);
  }
  
  updateAIStats();
}

function updateAIStats() {
  // Save to localStorage
  localStorage.setItem('aiRequests', aiStats.requests.toString());
  localStorage.setItem('aiCacheHits', aiStats.cacheHits.toString());
  localStorage.setItem('aiLastUsed', aiStats.lastUsed);
  localStorage.setItem('aiResponseTimes', JSON.stringify(aiStats.responseTimes));
  
  // Update display
  $('#aiRequestsCount').text(aiStats.requests);
  $('#aiCacheHits').text(aiStats.cacheHits);
  
  if (aiStats.lastUsed !== 'Never') {
    const lastUsedDate = new Date(aiStats.lastUsed);
    $('#aiLastUsed').text(lastUsedDate.toLocaleString());
  } else {
    $('#aiLastUsed').text('Never');
  }
  
  // Calculate average response time
  if (aiStats.responseTimes.length > 0) {
    const avgTime = Math.round(
      aiStats.responseTimes.reduce((a, b) => a + b, 0) / aiStats.responseTimes.length
    );
    $('#aiResponseTime').text(avgTime + 'ms');
  } else {
    $('#aiResponseTime').text('0ms');
  }
}

/**
 * ============================================================================
 * CACHING UTILITIES
 * ============================================================================
 */

function checkCache(key, hours = 24) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const now = Date.now();
    const cacheAge = now - data.timestamp;
    const cacheDuration = hours * 60 * 60 * 1000; // Convert hours to milliseconds
    
    if (cacheAge < cacheDuration) {
      return data.value;
    } else {
      localStorage.removeItem(key);
      return null;
    }
  } catch (error) {
    console.error('Error checking cache:', error);
    return null;
  }
}

function saveCache(key, value) {
  try {
    const data = {
      value: value,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = 'info') {
  // Simple notification using Bootstrap alerts
  const alertClass = `alert-${type}`;
  const notification = $(`
    <div class="alert ${alertClass} alert-dismissible fade show position-fixed top-0 end-0 m-3" role="alert" style="z-index: 9999;">
      ${escapeHtml(message)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `);
  
  $('body').append(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.fadeOut(() => notification.remove());
  }, 5000);
}
