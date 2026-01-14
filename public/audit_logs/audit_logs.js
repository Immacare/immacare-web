// Audit Logs JavaScript

let auditTable = null;
let allLogs = [];
let initialized = false;

// Initialize when document is ready or when loaded in iframe
function initAuditLogs() {
  if (initialized) return;
  initialized = true;
  
  console.log('[AUDIT UI] Initializing audit logs page...');
  
  // Set default date range (last 30 days) - use local date format
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Include today fully
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Format dates as YYYY-MM-DD for input fields
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  $('#endDate').val(formatDate(tomorrow));
  $('#startDate').val(formatDate(thirtyDaysAgo));
  
  console.log('[AUDIT UI] Date range:', formatDate(thirtyDaysAgo), 'to', formatDate(tomorrow));
  
  loadAuditLogs();
}

// Try both document ready and immediate execution for iframe compatibility
$(document).ready(function() {
  initAuditLogs();
});

// Also run on script load in case document is already ready (iframe case)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initAuditLogs, 100);
}

// Load audit logs from server
function loadAuditLogs() {
  const action = $('#actionFilter').val();
  const startDate = $('#startDate').val();
  const endDate = $('#endDate').val();
  
  // Build URL without date filters first to ensure we get data
  let url = '/audit-logs?limit=500';
  if (action && action !== 'all') url += `&action=${action}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  
  console.log('[AUDIT UI] Fetching logs from:', url);
  
  $.ajax({
    url: url,
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      console.log('[AUDIT UI] Response received:', response);
      if (response && response.success && response.data) {
        allLogs = response.data;
        console.log('[AUDIT UI] Loaded', response.data.length, 'logs');
        renderTable(response.data);
        updateSummary(response.data);
      } else {
        console.log('[AUDIT UI] No data in response or success=false');
        console.log('[AUDIT UI] Full response:', JSON.stringify(response));
        // Show empty state
        renderTable([]);
        updateSummary([]);
      }
    },
    error: function(xhr, status, error) {
      console.error('[AUDIT UI] Failed to load audit logs:', status, error);
      console.error('[AUDIT UI] Status code:', xhr.status);
      console.error('[AUDIT UI] Response:', xhr.responseText);
      // Show empty state on error
      renderTable([]);
      updateSummary([]);
    }
  });
}

// Render the audit logs table
function renderTable(logs) {
  // Destroy existing DataTable if it exists
  if (auditTable) {
    auditTable.destroy();
  }
  
  const tbody = $('#auditLogsBody');
  tbody.empty();
  
  logs.forEach(log => {
    const dateTime = new Date(log.createdAt).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const activityBadge = getActivityBadge(log.action);
    const roleBadge = getRoleBadge(log.userRole);
    
    tbody.append(`
      <tr>
        <td>${dateTime}</td>
        <td>${activityBadge}</td>
        <td>${escapeHtml(log.userName)}</td>
        <td>${roleBadge}</td>
        <td>${escapeHtml(log.userEmail || 'N/A')}</td>
        <td>${escapeHtml(log.details || '')}</td>
      </tr>
    `);
  });
  
  // Initialize DataTable
  auditTable = $('#auditLogsTable').DataTable({
    order: [[0, 'desc']],
    pageLength: 25,
    language: {
      search: "Search logs:",
      lengthMenu: "Show _MENU_ entries"
    }
  });
}

// Get activity badge HTML
function getActivityBadge(action) {
  const icons = {
    'login': 'bi-box-arrow-in-right',
    'register': 'bi-person-plus',
    'booking_created': 'bi-calendar-check'
  };
  
  const labels = {
    'login': 'Login',
    'register': 'Registration',
    'booking_created': 'Booking Created'
  };
  
  const icon = icons[action] || 'bi-activity';
  const label = labels[action] || action;
  
  return `<span class="activity-badge ${action}"><i class="bi ${icon}"></i>${label}</span>`;
}

// Get role badge HTML
function getRoleBadge(role) {
  if (!role) return '<span class="role-badge">N/A</span>';
  return `<span class="role-badge ${role.toLowerCase()}">${role}</span>`;
}

// Update summary counts
function updateSummary(logs) {
  const loginCount = logs.filter(l => l.action === 'login').length;
  const registerCount = logs.filter(l => l.action === 'register').length;
  const bookingCount = logs.filter(l => l.action === 'booking_created').length;
  
  $('#loginCount').text(loginCount);
  $('#registerCount').text(registerCount);
  $('#bookingCount').text(bookingCount);
}

// Clear filters
function clearFilters() {
  $('#actionFilter').val('all');
  
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  $('#endDate').val(today.toISOString().split('T')[0]);
  $('#startDate').val(thirtyDaysAgo.toISOString().split('T')[0]);
  
  loadAuditLogs();
}

// Print audit logs
function printAuditLogs() {
  // Get current user info for print header (role and full name)
  let userRole = 'Unknown';
  let userFullName = 'Unknown';
  
  // Try to get user info from parent window (iframe context)
  try {
    if (window.parent && window.parent !== window) {
      const parentUsername = window.parent.document.getElementById('usernameDisplay');
      const parentRole = window.parent.document.getElementById('role');
      if (parentUsername && parentUsername.textContent) {
        userFullName = parentUsername.textContent.trim();
      }
      if (parentRole && parentRole.value) {
        userRole = parentRole.value.charAt(0).toUpperCase() + parentRole.value.slice(1);
      }
    }
  } catch (e) {}
  
  // Fallback to localStorage if parent window didn't work
  if (userFullName === 'Unknown') {
    const sessionData = localStorage.getItem('sessionUser');
    if (sessionData) {
      try {
        const user = JSON.parse(sessionData);
        userFullName = `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unknown';
        userRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown';
      } catch (e) {}
    }
  }
  
  const startDate = $('#startDate').val() || 'N/A';
  const endDate = $('#endDate').val() || 'N/A';
  const actionFilter = $('#actionFilter option:selected').text();
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Audit Logs Report</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 15px; }
        .header h1 { margin: 0; color: #2c5282; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #2c5282; color: #fff; }
        tr:nth-child(even) { background: #f9f9f9; }
        .summary { display: flex; gap: 30px; margin-bottom: 20px; }
        .summary-item { text-align: center; }
        .summary-item .value { font-size: 24px; font-weight: bold; }
        .summary-item .label { font-size: 11px; color: #666; }
        .footer { margin-top: 30px; font-size: 11px; }
        .signature-line { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature-box { width: 200px; text-align: center; }
        .signature-box .line { border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>IMMACARE CLINIC</h1>
        <p>Audit Logs Report</p>
      </div>
      <div class="meta">
        <div>
          <strong>Date Range:</strong> ${startDate} to ${endDate}<br>
          <strong>Filter:</strong> ${actionFilter}
        </div>
        <div>
          <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
          <strong>Role:</strong> ${userRole}<br>
          <strong>Full Name:</strong> ${userFullName}
        </div>
      </div>
      <div class="summary">
        <div class="summary-item">
          <div class="value">${$('#loginCount').text()}</div>
          <div class="label">Logins</div>
        </div>
        <div class="summary-item">
          <div class="value">${$('#registerCount').text()}</div>
          <div class="label">Registrations</div>
        </div>
        <div class="summary-item">
          <div class="value">${$('#bookingCount').text()}</div>
          <div class="label">Bookings</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Activity</th>
            <th>User</th>
            <th>Role</th>
            <th>Email</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${allLogs.map(log => `
            <tr>
              <td>${new Date(log.createdAt).toLocaleString()}</td>
              <td>${log.action}</td>
              <td>${log.userName}</td>
              <td>${log.userRole || 'N/A'}</td>
              <td>${log.userEmail || 'N/A'}</td>
              <td>${log.details || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <div class="signature-line">
          <div class="signature-box">
            <div class="line">${userFullName} (${userRole})</div>
          </div>
          <div class="signature-box">
            <div class="line">Signature</div>
          </div>
        </div>
      </div>
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
