/**
 * Print Utilities for DataTables
 * Provides print functionality for all tables in the application
 */

// Global variable to store current user info for printing
let printUserInfo = null;

/**
 * Fetch current user info for print headers
 * @returns {Promise} Promise that resolves with user info
 */
function fetchPrintUserInfo() {
  if (printUserInfo) {
    return Promise.resolve(printUserInfo);
  }
  
  // Try to get user info from parent window first (for iframe context)
  try {
    if (window.parent && window.parent !== window) {
      const parentUsername = window.parent.document.getElementById('usernameDisplay');
      const parentRole = window.parent.document.getElementById('role');
      if (parentUsername && parentUsername.textContent) {
        printUserInfo = {
          fullName: parentUsername.textContent.trim(),
          role: parentRole && parentRole.value ? parentRole.value.charAt(0).toUpperCase() + parentRole.value.slice(1) : 'Unknown'
        };
        return Promise.resolve(printUserInfo);
      }
    }
  } catch (e) {
    // Cross-origin or other error, fall back to API call
  }
  
  return fetch('/homepage', {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(data => {
      printUserInfo = {
        fullName: `${data.firstname} ${data.lastname}`,
        role: data.role ? data.role.charAt(0).toUpperCase() + data.role.slice(1) : 'Unknown'
      };
      return printUserInfo;
    })
    .catch(() => {
      return { fullName: 'Unknown', role: 'Unknown' };
    });
}

/**
 * Print a DataTable with custom styling
 * @param {string} tableId - The ID of the table to print
 * @param {string} title - The title to display on the printed page
 * @param {Array} excludeColumns - Array of column indices to exclude from print (0-based)
 */
function printTable(tableId, title, excludeColumns = []) {
  const table = document.getElementById(tableId);
  if (!table) {
    alert('Table not found');
    return;
  }

  // Clone the table to avoid modifying the original
  const clonedTable = table.cloneNode(true);
  
  // Remove excluded columns (action buttons, hidden columns, etc.)
  if (excludeColumns.length > 0) {
    const rows = clonedTable.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('th, td');
      // Remove in reverse order to maintain correct indices
      excludeColumns.sort((a, b) => b - a).forEach(colIndex => {
        if (cells[colIndex]) {
          cells[colIndex].remove();
        }
      });
    });
  }

  // Remove any buttons from the cloned table
  const buttons = clonedTable.querySelectorAll('button, .btn, a.btn');
  buttons.forEach(btn => btn.remove());

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Fetch user info before printing
  fetchPrintUserInfo().then(userInfo => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - Print</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            font-size: 12px;
          }
          .print-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .print-header h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 5px;
          }
          .print-header .clinic-name {
            font-size: 18px;
            color: #0066cc;
            font-weight: bold;
          }
          .print-header .date {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .print-header .user-info {
            font-size: 12px;
            color: #333;
            margin-top: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .print-footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div class="clinic-name">IMMACARE+ CLINIC</div>
          <h1>${title}</h1>
          <div class="date">Generated on: ${currentDate}</div>
          <div class="user-info">
            <span><strong>Role:</strong> ${userInfo.role}</span>
            <span style="margin-left: 20px;"><strong>Full Name:</strong> ${userInfo.fullName}</span>
          </div>
        </div>
        ${clonedTable.outerHTML}
        <div class="print-footer">
          <p>This is a system-generated report from Immacare+ Clinic Management System</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  });
}

/**
 * Print DataTable data (works with AJAX-loaded data)
 * @param {object} dataTable - The DataTable instance
 * @param {string} title - The title to display on the printed page
 * @param {Array} columnsToPrint - Array of column indices to include in print
 * @param {Array} columnHeaders - Array of header names for the columns
 */
function printDataTable(dataTable, title, columnsToPrint, columnHeaders) {
  if (!dataTable) {
    alert('DataTable not initialized');
    return;
  }

  const data = dataTable.rows({ search: 'applied' }).data().toArray();
  
  if (data.length === 0) {
    alert('No data to print');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let tableRows = '';
  data.forEach(row => {
    tableRows += '<tr>';
    columnsToPrint.forEach(colIndex => {
      let cellValue = '';
      if (typeof colIndex === 'string') {
        cellValue = row[colIndex] || '';
      } else if (Array.isArray(row)) {
        cellValue = row[colIndex] || '';
      } else {
        // Handle object data
        const keys = Object.keys(row);
        cellValue = row[keys[colIndex]] || '';
      }
      // Strip HTML tags
      cellValue = String(cellValue).replace(/<[^>]*>/g, '');
      tableRows += `<td>${cellValue}</td>`;
    });
    tableRows += '</tr>';
  });

  let headerRow = '<tr>';
  columnHeaders.forEach(header => {
    headerRow += `<th>${header}</th>`;
  });
  headerRow += '</tr>';

  // Fetch user info before printing
  fetchPrintUserInfo().then(userInfo => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - Print</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            font-size: 12px;
          }
          .print-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .print-header h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 5px;
          }
          .print-header .clinic-name {
            font-size: 18px;
            color: #0066cc;
            font-weight: bold;
          }
          .print-header .date {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .print-header .user-info {
            font-size: 12px;
            color: #333;
            margin-top: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .print-footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
          .total-records {
            margin-top: 10px;
            font-weight: bold;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div class="clinic-name">IMMACARE+ CLINIC</div>
          <h1>${title}</h1>
          <div class="date">Generated on: ${currentDate}</div>
          <div class="user-info">
            <span><strong>Role:</strong> ${userInfo.role}</span>
            <span style="margin-left: 20px;"><strong>Full Name:</strong> ${userInfo.fullName}</span>
          </div>
        </div>
        <table>
          <thead>${headerRow}</thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div class="total-records">Total Records: ${data.length}</div>
        <div class="print-footer">
          <p>This is a system-generated report from Immacare+ Clinic Management System</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  });
}
