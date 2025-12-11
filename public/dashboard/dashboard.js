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
});

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
