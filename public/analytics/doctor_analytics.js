/**
 * Doctor Predictive Analytics JavaScript
 * 
 * PURPOSE:
 * Manages the predictive analytics dashboard for doctors with Patient Health Risk analysis.
 * Simplified version of the admin analytics - only shows Patient Health Risk graph.
 */

// Global variables
let healthRiskChart = null;
let aiStats = {
  requests: parseInt(localStorage.getItem('aiRequests') || '0'),
  cacheHits: parseInt(localStorage.getItem('aiCacheHits') || '0'),
  lastUsed: localStorage.getItem('aiLastUsed') || 'Never',
  responseTimes: JSON.parse(localStorage.getItem('aiResponseTimes') || '[]')
};

// Initialize page when DOM is ready
$(document).ready(async function() {
  console.log('🚀 Doctor Analytics page loaded');
  
  updateAIStats();
  
  const sessionValid = await debugSession();
  if (sessionValid) {
    console.log('✅ Session validated, loading analytics...');
    loadHealthRiskAnalysis();
  } else {
    console.error('❌ Session invalid, not loading analytics');
    showAIStatus('error', 'Authentication Required');
  }
});

/**
 * Debug function to check session state
 */
async function debugSession() {
  console.log('🔍 Checking session state...');
  
  try {
    const response = await fetch('/homepage', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ No session found - 401 Unauthorized');
        showNotification('Please log in to access analytics.', 'danger');
        return false;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Session valid for user:', data.email, 'Role:', data.role);
    return true;
  } catch (error) {
    console.error('❌ Session check failed:', error);
    return false;
  }
}

/**
 * Refresh analytics data
 */
function refreshAnalytics() {
  showNotification('Refreshing analytics data...', 'info');
  loadHealthRiskAnalysis();
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
      credentials: 'include'
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
    localStorage.removeItem(cacheKey);
    console.log('🔄 Force refreshing - bypassing cache...');
    
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
      credentials: 'include',
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
    text += ' <br><small class="text-info"><i class="bi bi-info-circle me-1"></i><strong>Note:</strong> These insights are from cache (saved API cost). Click "Force Refresh" for fresh insights.</small>';
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
  
  if (aiStats.responseTimes.length > 50) {
    aiStats.responseTimes = aiStats.responseTimes.slice(-50);
  }
  
  updateAIStats();
}

function updateAIStats() {
  localStorage.setItem('aiRequests', aiStats.requests.toString());
  localStorage.setItem('aiCacheHits', aiStats.cacheHits.toString());
  localStorage.setItem('aiLastUsed', aiStats.lastUsed);
  localStorage.setItem('aiResponseTimes', JSON.stringify(aiStats.responseTimes));
  
  $('#aiRequestsCount').text(aiStats.requests);
  $('#aiCacheHits').text(aiStats.cacheHits);
  
  if (aiStats.lastUsed !== 'Never') {
    const lastUsedDate = new Date(aiStats.lastUsed);
    $('#aiLastUsed').text(lastUsedDate.toLocaleString());
  } else {
    $('#aiLastUsed').text('Never');
  }
  
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
    const cacheDuration = hours * 60 * 60 * 1000;
    
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
  const alertClass = `alert-${type}`;
  const notification = $(`
    <div class="alert ${alertClass} alert-dismissible fade show position-fixed top-0 end-0 m-3" role="alert" style="z-index: 9999;">
      ${escapeHtml(message)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `);
  
  $('body').append(notification);
  
  setTimeout(() => {
    notification.fadeOut(() => notification.remove());
  }, 5000);
}
