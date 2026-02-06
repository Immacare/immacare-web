// $(document).ready(function () {
//   const table = $("#dashboardTable").DataTable({
//     searching: false,
//     responsive: true,
//     lengthChange: false,
//     info: false,
//   });

//   $.get("/appointment-count", function (data) {
//     $("#appointmentCount").text(data.total_booked);
//   }).fail(function (xhr) {
//     alert(xhr.responseJSON.message);
//   });

//   $.get("/appointment-count-today", function (data) {
//     $("#patientTodayCount").text(data.total_booked_today);
//   }).fail(function (xhr) {
//     alert(xhr.responseJSON.message);
//   });

//   $.get("/overall_patients", function (data) {
//     $("#patientCount").text(data.patient_count);
//   }).fail(function (xhr) {
//     alert(xhr.responseJSON.message);
//   });

//   $.get("/item-inventory-count", function (data) {
//     $("#inventoryCount").text(data.inventory_count);
//   }).fail(function (xhr) {
//     alert(xhr.responseJSON.message);
//   });
// });

// function showTable() {
//   $('#dashboardTable').css('display', 'table'); // reveal table after data loads
// }

// function handleAjaxError(xhr, status, error) {
//   console.error("AJAX Error:", status, error, xhr?.responseText);
//   alert("Error loading data. Please try again.");
// }

/**
 * Dashboard JavaScript
 * 
 * PURPOSE:
 * Manages the admin/staff dashboard interface. Loads and displays statistics,
 * manages DataTables for various data views, and provides functions to switch
 * between different dashboard views (appointments, patients, inventory).
 * 
 * FUNCTIONALITY:
 * 1. Initializes DataTables for data display
 * 2. Loads dashboard statistics (appointment counts, patient counts, inventory counts)
 * 3. Provides functions to display different data views:
 *    - PatientToday() - Shows today's patients
 *    - Bookings() - Shows all bookings
 *    - getInventory() - Shows inventory items
 *    - getAllPatients() - Shows all patients
 * 
 * API ENDPOINTS USED:
 * - GET /appointment-count - Total booked appointments
 * - GET /appointment-count-today - Today's appointments
 * - GET /overall_patients - Total patient count
 * - GET /item-inventory-count - Total inventory items
 * - GET /getPatientsToday - Today's patient list
 * - GET /getBookings - All bookings list
 * - GET /getInventoryDashboard - Inventory items list
 * - GET /getAllPatients - All patients list
 * 
 * DEPENDENCIES:
 * - jQuery
 * - DataTables (for table functionality)
 * - Chart.js (commented out, available for future charts)
 */

$(document).ready(function () {
  const table = $("#dashboardTable").DataTable({
    searching: false,
    responsive: true,
    lengthChange: false,
    info: false,
  });

  // const ctx = document.getElementById("myChart").getContext("2d");

  // const myChart = new Chart(ctx, {
  //   type: "bar", // or 'line', 'pie', etc.
  //   data: {
  //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //     datasets: [
  //       {
  //         label: "Sample Votes",
  //         data: [12, 19, 3, 5, 2, 3],
  //         backgroundColor: [
  //           "rgba(255, 99, 132, 0.2)",
  //           "rgba(54, 162, 235, 0.2)",
  //           "rgba(255, 206, 86, 0.2)",
  //           "rgba(75, 192, 192, 0.2)",
  //           "rgba(153, 102, 255, 0.2)",
  //           "rgba(255, 159, 64, 0.2)",
  //         ],
  //         borderColor: [
  //           "rgba(255,99,132,1)",
  //           "rgba(54,162,235,1)",
  //           "rgba(255,206,86,1)",
  //           "rgba(75,192,192,1)",
  //           "rgba(153,102,255,1)",
  //           "rgba(255,159,64,1)",
  //         ],
  //         borderWidth: 1,
  //       },
  //     ],
  //   },
  //   options: {
  //     responsive: true,
  //     scales: {
  //       y: {
  //         beginAtZero: true,
  //       },
  //     },
  //   },
  // });

  // ============================================================================
  // LOAD DASHBOARD STATISTICS
  // ============================================================================
  // These AJAX calls fetch and display key statistics on the dashboard

  // Load total booked appointments count
  $.get("/appointment-count", function (data) {
    $("#appointmentCount").text(data.total_booked);
  }).fail(function (xhr) {
    alert(xhr.responseJSON.message);
  });

  // Load today's appointment count
  $.get("/appointment-count-today", function (data) {
    $("#patientTodayCount").text(data.total_booked_today);
  }).fail(function (xhr) {
    alert(xhr.responseJSON.message);
  });

  // Load total patient count
  $.get("/overall_patients", function (data) {
    $("#patientCount").text(data.patient_count);
  }).fail(function (xhr) {
    alert(xhr.responseJSON.message);
  });

  // Load total inventory items count
  $.get("/item-inventory-count", function (data) {
    $("#inventoryCount").text(data.inventory_count);
  }).fail(function (xhr) {
    console.error("Error loading inventory count");
  });

  // Load completed today count
  $.get("/appointment-count-completed-today", function (data) {
    $("#completedTodayCount").text(data.count || 0);
  }).fail(function (xhr) {
    console.error("Error loading completed today count");
  });

  // Load in-queue count
  $.get("/appointment-count-in-queue", function (data) {
    $("#inQueueCount").text(data.count || 0);
  }).fail(function (xhr) {
    console.error("Error loading in-queue count");
  });

  // Load cancelled count
  $.get("/appointment-count-cancelled", function (data) {
    $("#cancelledCount").text(data.count || 0);
  }).fail(function (xhr) {
    console.error("Error loading cancelled count");
  });

  // Load doctor count
  $.get("/doctor-count", function (data) {
    $("#doctorCount").text(data.count || 0);
  }).fail(function (xhr) {
    console.error("Error loading doctor count");
  });

  // Check if user is admin/staff and load predictive analytics and inventory transactions
  checkAdminAndLoadAnalytics();
});

// ============================================================================
// DASHBOARD ANALYTICS CHARTS
// ============================================================================

let dashboardAppointmentChart = null;
let dashboardInventoryChart = null;
let dashboardHealthChart = null;

/**
 * Check if user is admin and load analytics if so
 * Also controls visibility of inventory transactions section based on role
 */
function checkAdminAndLoadAnalytics() {
  $.get("/homepage", function (data) {
    if (data.role === 'admin') {
      // Show the predictive analytics section
      const analyticsSection = document.getElementById('predictiveAnalyticsSection');
      if (analyticsSection) {
        analyticsSection.style.display = 'flex';
      }
      // Load the charts
      loadDashboardAnalytics();
    }

    // Show inventory transactions section for admin and staff only (not for doctors)
    if (data.role === 'admin' || data.role === 'staff') {
      const inventorySection = document.getElementById('inventoryTransactionsSection');
      if (inventorySection) {
        inventorySection.style.display = 'block';
      }
      // Load the transactions data
      loadRecentInventoryTransactions();
    }
  }).fail(function () {
    console.error("Error checking user role for analytics");
  });
}

/**
 * Load all dashboard analytics charts
 */
function loadDashboardAnalytics() {
  loadDashboardAppointmentChart();
  loadDashboardInventoryChart();
  loadDashboardHealthChart();
}

/**
 * Load appointment forecast chart for dashboard
 */
function loadDashboardAppointmentChart() {
  const ctx = document.getElementById('dashboardAppointmentChart');
  if (!ctx) return;

  $.get("/analytics/appointment-forecast", function (data) {
    if (data.success) {
      renderDashboardAppointmentChart(ctx, data.data);
    }
  }).fail(function () {
    // Show placeholder if data unavailable
    renderPlaceholderChart(ctx, 'Appointment Data');
  });
}

function renderDashboardAppointmentChart(ctx, data) {
  if (dashboardAppointmentChart) {
    dashboardAppointmentChart.destroy();
  }

  const labels = data.historical.map(d => d.date);
  const historicalData = data.historical.map(d => d.count);
  const forecastData = data.forecast.map(d => d.predicted);
  const forecastLabels = data.forecast.map(d => d.date);

  dashboardAppointmentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...labels, ...forecastLabels],
      datasets: [
        {
          label: 'Historical',
          data: [...historicalData, ...new Array(forecastLabels.length).fill(null)],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 2
        },
        {
          label: 'Predicted',
          data: [...new Array(labels.length).fill(null), ...forecastData],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderDash: [5, 5],
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { display: false },
        y: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    }
  });
}

/**
 * Load inventory status chart for dashboard
 */
function loadDashboardInventoryChart() {
  const ctx = document.getElementById('dashboardInventoryChart');
  if (!ctx) return;

  $.get("/analytics/inventory-forecast", function (data) {
    if (data.success) {
      renderDashboardInventoryChart(ctx, data.data);
    }
  }).fail(function () {
    renderPlaceholderChart(ctx, 'Inventory Data');
  });
}

function renderDashboardInventoryChart(ctx, data) {
  if (dashboardInventoryChart) {
    dashboardInventoryChart.destroy();
  }

  // Use reorderPredictions from API
  const items = data.reorderPredictions || [];
  const itemNames = items.slice(0, 8).map(d => d.item);
  const currentStock = items.slice(0, 8).map(d => d.currentQuantity);
  const reorderThreshold = items.slice(0, 8).map(d => d.reorderThreshold);

  dashboardInventoryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: itemNames,
      datasets: [
        {
          label: 'Current Stock',
          data: currentStock,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Reorder Threshold',
          data: reorderThreshold,
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
        legend: { position: 'top', labels: { boxWidth: 12, font: { size: 10 } } }
      },
      scales: {
        x: { ticks: { font: { size: 9 }, maxRotation: 45 } },
        y: { beginAtZero: true }
      }
    }
  });
}

/**
 * Load health/patient trends chart for dashboard
 */
function loadDashboardHealthChart() {
  const ctx = document.getElementById('dashboardHealthChart');
  if (!ctx) return;

  $.get("/analytics/health-risk-analysis", function (data) {
    if (data.success) {
      renderDashboardHealthChart(ctx, data.data);
    }
  }).fail(function () {
    renderPlaceholderChart(ctx, 'Patient Data');
  });
}

function renderDashboardHealthChart(ctx, data) {
  if (dashboardHealthChart) {
    dashboardHealthChart.destroy();
  }

  // Use riskDistribution from API
  const riskDistribution = data.riskDistribution || { high: 0, medium: 0, low: 0 };

  dashboardHealthChart = new Chart(ctx, {
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
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
      }
    }
  });
}

/**
 * Render placeholder chart when data is unavailable
 */
function renderPlaceholderChart(ctx, label) {
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['No Data'],
      datasets: [{
        label: label,
        data: [0],
        backgroundColor: '#e9ecef'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

/**
 * PatientToday
 * Purpose: Display list of patients with appointments today
 * 
 * Process:
 *   1. Destroys existing DataTable if present
 *   2. Fetches today's patients from API
 *   3. Initializes DataTable with patient data
 *   4. Displays table with patient name, consultation type, and status
 */
function PatientToday() {
  if ($.fn.DataTable.isDataTable("#dashboardTable")) {
    $("#dashboardTable").DataTable().destroy();
    $("#dashboardTable").empty();
  }

  const columns = [
    { title: "Patient Name", data: "patient_name" },
    { title: "Consultation Type", data: "consultation_type" },
    { title: "Status", data: "status" },
  ];

  $.ajax({
    url: "/getPatientsToday",
    method: "GET",
    dataType: "json",
    success: function (response) {
      if (response && Array.isArray(response)) {
        $("#dashboardTable").DataTable({
          data: response,
          columns: columns,
          paging: true,
          searching: true,
          info: true,
          responsive: true,
        });

        $("#dashboardTable").css("display", "table"); // Use 'table' if it's a <table> element
      } else {
        console.error("Invalid data format received:", response);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      alert("Error loading patient data. Please try again.");
    },
  });
}

/**
 * Bookings
 * Purpose: Display list of all bookings/appointments
 * 
 * Process:
 *   1. Destroys existing DataTable if present
 *   2. Fetches all bookings from API
 *   3. Initializes DataTable with booking data
 *   4. Displays table with patient name, consultation type, and status
 */
function Bookings() {
  if ($.fn.DataTable.isDataTable("#dashboardTable")) {
    $("#dashboardTable").DataTable().destroy();
    $("#dashboardTable").empty();
  }

  const columns = [
    { title: "Patient Name", data: "patient_name" },
    { title: "Consultation Type", data: "consultation_type" },
    { title: "Status", data: "status" },
  ];

  $.ajax({
    url: "/getBookings",
    method: "GET",
    dataType: "json",
    success: function (response) {
      if (response && Array.isArray(response)) {
        $("#dashboardTable").DataTable({
          data: response,
          columns: columns,
          paging: true,
          searching: true,
          info: true,
          responsive: true,
        });
      } else {
        console.error("Invalid data format received:", response);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      alert("Error loading patient data. Please try again.");
    },
  });
}

/**
 * getInventory
 * Purpose: Display list of inventory items
 * 
 * Process:
 *   1. Destroys existing DataTable if present
 *   2. Fetches inventory items from API
 *   3. Initializes DataTable with inventory data
 *   4. Displays table with item name, category, quantity, and status
 */
function getInventory() {
  if ($.fn.DataTable.isDataTable("#dashboardTable")) {
    $("#dashboardTable").DataTable().destroy();
    $("#dashboardTable").empty();
  }

  const columns = [
    { title: "Item", data: "item" },
    { title: "Category", data: "category" },
    { title: "Quantity", data: "quantity" },
    { title: "Status", data: "status" },
  ];

  $.ajax({
    url: "/getInventoryDashboard",
    method: "GET",
    dataType: "json",
    success: function (response) {
      if (response && Array.isArray(response)) {
        $("#dashboardTable").DataTable({
          data: response,
          columns: columns,
          paging: true,
          searching: true,
          info: true,
          responsive: true,
        });
      } else {
        console.error("Invalid data format received:", response);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      alert("Error loading patient data. Please try again.");
    },
  });
}

/**
 * getAllPatients
 * Purpose: Display list of all patients in the system
 * 
 * Process:
 *   1. Destroys existing DataTable if present
 *   2. Fetches all patients from API
 *   3. Initializes DataTable with patient data
 *   4. Displays table with patient name, gender, age, contact number, and email
 */
function getAllPatients() {
  if ($.fn.DataTable.isDataTable("#dashboardTable")) {
    $("#dashboardTable").DataTable().destroy();
    $("#dashboardTable").empty();
  }

  const columns = [
    { title: "Patient Name", data: "fullname" },
    { title: "Gender", data: "gender" },
    { title: "Age", data: "age" },
    { title: "Contact Number", data: "mobile_number" },
    { title: "Email Address", data: "email_address" },
  ];

  $.ajax({
    url: "/getAllPatients",
    method: "GET",
    dataType: "json",
    success: function (response) {
      if (response && Array.isArray(response)) {
        $("#dashboardTable").DataTable({
          data: response,
          columns: columns,
          paging: true,
          searching: true,
          info: true,
          responsive: true,
        });
      } else {
        console.error("Invalid data format received:", response);
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      alert("Error loading patient data. Please try again.");
    },
  });
}

// ============================================================================
// INVENTORY TRANSACTIONS
// ============================================================================

/**
 * Load recent inventory transactions for dashboard display
 */
function loadRecentInventoryTransactions() {
  $.ajax({
    url: "/api/inventory-transactions",
    method: "GET",
    data: { limit: 10 },
    dataType: "json",
    success: function (response) {
      const tbody = $("#inventoryTransactionsBody");
      tbody.empty();

      if (response.success && response.data && response.data.length > 0) {
        response.data.forEach(function (tx) {
          const date = new Date(tx.createdAt);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }) + ', ' + date.toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', hour12: true
          });

          // Determine badge color based on transaction type
          let typeBadge = 'bg-secondary';
          if (tx.transactionType === 'sale') typeBadge = 'bg-primary';
          else if (tx.transactionType === 'restock') typeBadge = 'bg-success';
          else if (tx.transactionType === 'adjustment') typeBadge = 'bg-warning text-dark';
          else if (tx.transactionType === 'waste') typeBadge = 'bg-danger';

          // Format quantity change
          let changeText = tx.quantityChange || 0;
          let changeClass = '';
          if (changeText > 0) {
            changeText = '+' + changeText;
            changeClass = 'text-success fw-bold';
          } else if (changeText < 0) {
            changeClass = 'text-danger fw-bold';
          }

          const row = `
            <tr>
              <td>${formattedDate}</td>
              <td>${tx.itemName || 'N/A'}</td>
              <td>${tx.categoryName || 'N/A'}</td>
              <td><span class="badge ${typeBadge}">${tx.transactionType || 'N/A'}</span></td>
              <td class="${changeClass}">${changeText}</td>
              <td>${tx.performedBy?.userName || 'System'}</td>
              <td>${tx.notes || '-'}</td>
            </tr>
          `;
          tbody.append(row);
        });
      } else {
        tbody.html('<tr><td colspan="7" class="text-center text-muted py-3">No recent transactions</td></tr>');
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading inventory transactions:", error);
      $("#inventoryTransactionsBody").html('<tr><td colspan="7" class="text-center text-danger py-3">Error loading transactions</td></tr>');
    }
  });
}

/**
 * Print the current dashboard table
 */
function printDashboardTable() {
  const table = $.fn.DataTable.isDataTable("#dashboardTable")
    ? $("#dashboardTable").DataTable()
    : null;

  if (table && table.data().count() > 0) {
    const columns = table.columns().header().toArray();
    const headers = columns.map(col => $(col).text());
    const dataKeys = table.settings().init().columns.map(col => col.data);

    printDataTable(
      table,
      'Dashboard Report',
      dataKeys,
      headers
    );
  } else {
    alert('No data to print. Please select a view first (e.g., "More Info" on a card).');
  }
}
