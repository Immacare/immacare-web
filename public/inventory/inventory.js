document.addEventListener("DOMContentLoaded", function () {
  const updateButtons = document.querySelectorAll(".add-item");

  updateButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const userId = this.getAttribute("data-user-id");

      document.getElementById("modal_user_id").value = userId;
    });
  });
});
let table;
$(document).ready(function () {
  table = $("#inventoryTable").DataTable({
    columnDefs: [
      {
        targets: [0], // Index of column to hide (0-based) - ID column
        visible: false,
      },
    ],
    searching: false,
    lengthChange: false,
    dom: "Bfrtip",
    buttons: [
      {
        extend: "excel",
        text: "Export to Excel",
        title: "Inventory Report",
        filename: "Inventory_Report_" + new Date().toISOString().slice(0, 10),
        exportOptions: {
          columns: ":visible"
        }
      },
      {
        extend: "pdf",
        text: "Export to PDF",
        title: "IMMACARE CLINIC\nInventory Report",
        filename: "Inventory_Report_" + new Date().toISOString().slice(0, 10),
        orientation: "landscape",
        pageSize: "A4",
        exportOptions: {
          columns: ":visible"
        },
        customize: function(doc) {
          // Get user info from parent window (iframe context)
          let userName = 'Unknown';
          let userRole = 'Unknown';
          try {
            if (window.parent && window.parent !== window) {
              const parentUsername = window.parent.document.getElementById('usernameDisplay');
              const parentRole = window.parent.document.getElementById('role');
              if (parentUsername && parentUsername.textContent) {
                userName = parentUsername.textContent.trim();
              }
              if (parentRole && parentRole.value) {
                userRole = parentRole.value.charAt(0).toUpperCase() + parentRole.value.slice(1);
              }
            }
          } catch (e) {}
          
          // Add header with user info
          doc.content.splice(0, 0, {
            text: 'IMMACARE CLINIC',
            style: 'clinicHeader',
            alignment: 'center',
            margin: [0, 0, 0, 5]
          });
          doc.content.splice(1, 0, {
            text: 'Inventory Report',
            style: 'reportTitle',
            alignment: 'center',
            margin: [0, 0, 0, 10]
          });
          doc.content.splice(2, 0, {
            columns: [
              { text: 'Report Period: All Items (Current Inventory)', style: 'subheader', alignment: 'left' },
              { text: 'Generated: ' + new Date().toLocaleString(), style: 'subheader', alignment: 'right' }
            ],
            margin: [0, 0, 0, 5]
          });
          doc.content.splice(3, 0, {
            columns: [
              { text: '', width: '*' },
              { text: 'Role: ' + userRole + '\nFull Name: ' + userName, style: 'userInfo', alignment: 'right' }
            ],
            margin: [0, 0, 0, 15]
          });
          
          // Remove default title
          if (doc.content[4] && doc.content[4].text === 'IMMACARE CLINIC\nInventory Report') {
            doc.content.splice(4, 1);
          }
          
          // Add custom styles
          doc.styles.clinicHeader = {
            fontSize: 18,
            bold: true,
            color: '#0066cc'
          };
          doc.styles.reportTitle = {
            fontSize: 14,
            bold: true
          };
          doc.styles.subheader = {
            fontSize: 10,
            color: '#666'
          };
          doc.styles.userInfo = {
            fontSize: 10,
            color: '#333'
          };
        }
      }
    ],
    scrollX: false,
    autoWidth: false,
    responsive: false,
    ajax: {
      url: "/getInventory",
      dataSrc: "data",
      data: function (d) {
        d.item = $("#itemSearch").val();
        d.status = $("#ItemStatus").val();
      },
    },
    columns: [
      { data: "id", width: "0px" },
      { data: "item", width: "120px" },
      {
        data: "category",
        width: "200px",
        render: function (data, type, row) {
          if (type === "display") {
            return `
              <select class="form-select form-select-sm category-select" data-id="${row.id}">
                <option value="" ${!data ? 'selected' : ''}>Select...</option>
                <option value="1" ${data == 'Medicines / Pharmaceuticals' || row.category_id == 1 ? 'selected' : ''}>Medicines / Pharmaceuticals</option>
                <option value="2" ${data == 'Personal Protective Equipment (PPE)' || row.category_id == 2 ? 'selected' : ''}>Personal Protective Equipment (PPE)</option>
                <option value="3" ${data == 'Medical Instruments / Tools' || row.category_id == 3 ? 'selected' : ''}>Medical Instruments / Tools</option>
                <option value="4" ${data == 'Consumables / Disposables' || row.category_id == 4 ? 'selected' : ''}>Consumables / Disposables</option>
                <option value="5" ${data == 'Contraceptives' || row.category_id == 5 ? 'selected' : ''}>Contraceptives</option>
              </select>
            `;
          }
          return data;
        },
      },
      { 
        data: "unit", 
        width: "80px",
        defaultContent: "",
        render: function (data, type, row) {
          if (type === "display") {
            return `<input type="text" class="form-control form-control-sm inline-edit" data-id="${row.id}" data-field="unit" value="${data || ''}">`;
          }
          return data;
        }
      },
      { 
        data: "beginning_balance", 
        width: "100px",
        defaultContent: "0",
        render: function (data, type, row) {
          if (type === "display") {
            return `<input type="number" class="form-control form-control-sm inline-edit" data-id="${row.id}" data-field="beginning_balance" value="${data || 0}">`;
          }
          return data;
        }
      },
      { 
        data: "adjustments", 
        width: "100px",
        defaultContent: "0",
        render: function (data, type, row) {
          if (type === "display") {
            return `<input type="number" class="form-control form-control-sm inline-edit" data-id="${row.id}" data-field="adjustments" value="${data || 0}">`;
          }
          return data;
        }
      },
      {
        data: null,
        width: "100px",
        render: function (data, type, row) {
          // (C) Total Available = A + B
          const beginningBalance = parseFloat(row.beginning_balance) || 0;
          const adjustments = parseFloat(row.adjustments) || 0;
          const total = beginningBalance + adjustments;
          if (type === "display") {
            return `<input type="number" class="form-control form-control-sm" value="${total}" readonly disabled>`;
          }
          return total;
        },
      },
      { 
        data: "actual_stock", 
        width: "100px",
        defaultContent: "0",
        render: function (data, type, row) {
          if (type === "display") {
            return `<input type="number" class="form-control form-control-sm inline-edit" data-id="${row.id}" data-field="actual_stock" value="${data || 0}">`;
          }
          return data;
        }
      },
      { 
        data: "qty_used", 
        width: "100px",
        defaultContent: "0",
        render: function (data, type, row) {
          if (type === "display") {
            return `<input type="number" class="form-control form-control-sm inline-edit" data-id="${row.id}" data-field="qty_used" value="${data || 0}">`;
          }
          return data;
        }
      },
      { 
        data: "qty_wasted", 
        width: "100px",
        defaultContent: "0",
        render: function (data, type, row) {
          if (type === "display") {
            return `<input type="number" class="form-control form-control-sm inline-edit" data-id="${row.id}" data-field="qty_wasted" value="${data || 0}">`;
          }
          return data;
        }
      },
      { 
        data: "months_usage", 
        width: "100px",
        defaultContent: "0",
        render: function (data, type, row) {
          if (type === "display") {
            return `<input type="number" class="form-control form-control-sm inline-edit" data-id="${row.id}" data-field="months_usage" value="${data || 0}">`;
          }
          return data;
        }
      },
      { 
        data: "abl", 
        width: "80px",
        defaultContent: "0",
        render: function (data, type, row) {
          if (type === "display") {
            return `<input type="number" class="form-control form-control-sm inline-edit" data-id="${row.id}" data-field="abl" value="${data || 0}">`;
          }
          return data;
        }
      },
      {
        data: null,
        width: "100px",
        render: function (data, type, row) {
          // (I) Qty Required = ABL - Ending Balance (if negative, show 0)
          const abl = parseFloat(row.abl) || 0;
          const actualStock = parseFloat(row.actual_stock) || 0;
          const qtyUsed = parseFloat(row.qty_used) || 0;
          const qtyWasted = parseFloat(row.qty_wasted) || 0;
          const endingBalance = actualStock - qtyUsed - qtyWasted;
          const qtyRequired = abl - endingBalance;
          const value = qtyRequired > 0 ? qtyRequired : 0;
          if (type === "display") {
            return `<input type="number" class="form-control form-control-sm" value="${value}" readonly disabled>`;
          }
          return value;
        },
      },
      {
        data: null,
        width: "80px",
        render: function (data, type, row) {
          // (J) Stock = D - E
          const actualStock = parseFloat(row.actual_stock) || 0;
          const qtyUsed = parseFloat(row.qty_used) || 0;
          const stock = actualStock - qtyUsed;
          if (type === "display") {
            // Color code based on value
            let bgClass = stock > 0 ? 'bg-success-light' : (stock < 0 ? 'bg-danger-light' : '');
            return `<span class="stock-value ${bgClass}">${stock}</span>`;
          }
          return stock;
        },
      },
      {
        data: null,
        width: "100px",
        render: function (data, type, row) {
          // (K) Ending Balance = D - E - F
          const actualStock = parseFloat(row.actual_stock) || 0;
          const qtyUsed = parseFloat(row.qty_used) || 0;
          const qtyWasted = parseFloat(row.qty_wasted) || 0;
          const endingBalance = actualStock - qtyUsed - qtyWasted;
          if (type === "display") {
            // Color code based on ABL comparison
            const abl = parseFloat(row.abl) || 0;
            let bgClass = '';
            if (endingBalance <= 0) {
              bgClass = 'bg-danger-light';
            } else if (abl > 0 && endingBalance < abl) {
              bgClass = 'bg-warning-light';
            } else {
              bgClass = 'bg-success-light';
            }
            return `<span class="ending-balance-value ${bgClass}">${endingBalance}</span>`;
          }
          return endingBalance;
        },
      },
      {
        data: "price",
        width: "100px",
        render: function (data, type, row) {
          if (type === "display") {
            return `<input type="number" class="form-control form-control-sm inline-edit" data-id="${row.id}" data-field="price" value="${data || 0}">`;
          }
          return data;
        },
      },
      {
        data: "status",
        width: "130px",
        render: function (data, type, row) {
          if (type === "display") {
            let statusClass = "";
            if (data && data.toLowerCase() === "out of stock") {
              statusClass = "status-out-of-stock";
            } else if (data && data.toLowerCase() === "in stock") {
              statusClass = "status-in-stock";
            } else if (data && data.toLowerCase() === "for reorder") {
              statusClass = "status-for-reorder";
            }
            return `
              <select class="form-select form-select-sm status-select ${statusClass}" data-id="${row.id}">
                <option value="In Stock" ${data == 'In Stock' ? 'selected' : ''}>In Stock</option>
                <option value="Out of Stock" ${data == 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
                <option value="For Reorder" ${data == 'For Reorder' ? 'selected' : ''}>For Reorder</option>
              </select>
            `;
          }
          return data;
        },
      },
      {
        data: null,
        width: "60px",
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          return `
            <button class="btn btn-danger btn-sm delete-item-btn" data-id="${row.id}" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          `;
        },
      },
    ],
    createdRow: function (row, data, dataIndex) {
      // Row styling handled by CSS alternating colors only (white/gray)
    },
  });

  $("#ItemStatus").on("change", function () {
    table.ajax.reload();
  });
});

function saveItem() {
  const addItem = $("#addItem2").val();
  const addCategory = $("#addCategory").val();
  const addUnit = $("#addUnit").val();
  const addBeginningBalance = $("#addBeginningBalance").val() || 0;
  const addAdjustments = $("#addAdjustments").val() || 0;
  const addActualStock = $("#addActualStock").val() || 0;
  const addQtyUsed = $("#addQtyUsed").val() || 0;
  const addQtyWasted = $("#addQtyWasted").val() || 0;
  const addMonthsUsage = $("#addMonthsUsage").val() || 0;
  const addABL = $("#addABL").val() || 0;
  const addPrice = $("#addPrice").val() || 0;

  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to save this item?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    confirmButtonText: "Yes, Save it!",
    backdrop: false,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/saveInventoryItem",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          addItem,
          addCategory,
          addUnit,
          addBeginningBalance,
          addAdjustments,
          addActualStock,
          addQtyUsed,
          addQtyWasted,
          addMonthsUsage,
          addABL,
          addPrice,
        }),
        success: function (response) {
          Swal.fire({
            icon: "success",
            title: "Saved!",
            text: addItem + " has been saved successfully.",
          }).then(() => {
            $("#addItem").modal("hide");
            table.ajax.reload();
          });
        },
        error: function (xhr) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: xhr.responseJSON?.message || "Something went wrong.",
          });
        },
      });
    }
  });
}

function searchInventory() {
  table.ajax.reload();
}

function clearCriteria() {
  $(".criteria").val("");
  table.ajax.reload();
}

$(document).on("click", ".get-item-btn", function () {
  const id = $(this).data("id");

  $.ajax({
    url: `/getItemInventoryByID/${id}`,
    method: "GET",
    success: function (response) {
      const item = response.data[0];

      $("#updateItemName").val(item.item);
      $("#updateCategory").val(item.category_id);
      $("#updateUnit").val(item.unit);
      $("#updateBeginningBalance").val(item.beginning_balance);
      $("#updateAdjustments").val(item.adjustments);
      $("#updateActualStock").val(item.actual_stock);
      $("#updateQtyUsed").val(item.qty_used);
      $("#updateQtyWasted").val(item.qty_wasted);
      $("#updateMonthsUsage").val(item.months_usage);
      $("#updateABL").val(item.abl);
      $("#updatePrice").val(item.price);
      $("#updateID").val(id);
    },
    error: function () {
      alert("Failed to load inventory");
    },
  });
});

function updateItem() {
  const id = $("#updateID").val();
  const updateItemName = $("#updateItemName").val();
  const updateCategory = $("#updateCategory").val();
  const updateUnit = $("#updateUnit").val();
  const updateBeginningBalance = $("#updateBeginningBalance").val() || 0;
  const updateAdjustments = $("#updateAdjustments").val() || 0;
  const updateActualStock = $("#updateActualStock").val() || 0;
  const updateQtyUsed = $("#updateQtyUsed").val() || 0;
  const updateQtyWasted = $("#updateQtyWasted").val() || 0;
  const updateMonthsUsage = $("#updateMonthsUsage").val() || 0;
  const updateABL = $("#updateABL").val() || 0;
  const updatePrice = $("#updatePrice").val() || 0;

  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to update this item?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    confirmButtonText: "Yes, update it!",
    backdrop: false,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/updateInventory",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          id,
          updateItemName,
          updateCategory,
          updateUnit,
          updateBeginningBalance,
          updateAdjustments,
          updateActualStock,
          updateQtyUsed,
          updateQtyWasted,
          updateMonthsUsage,
          updateABL,
          updatePrice,
        }),
        success: function (response) {
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Item has been updated successfully.",
          }).then(() => {
            $("#updateItem").modal("hide");
            table.ajax.reload();
          });
        },
        error: function (xhr) {
          alert("Error: " + xhr.responseJSON.message);
        },
      });
    }
  });
}

function discardChanges() {
  $(".form-control").val("");
  $(".form-select").val("");
  $("#addItem").modal("hide");
  $("#updateItem").modal("hide");
}

/**
 * Show the print inventory modal
 */
function printInventory() {
  if (typeof table === 'undefined' || !table) {
    alert('No data to print. Please load the table first.');
    return;
  }

  const data = table.rows({ search: 'applied' }).data().toArray();
  
  if (data.length === 0) {
    alert('No data to print');
    return;
  }

  // Reset modal fields
  $('#printFromDate').val('');
  $('#printToDate').val('');
  $('#printMonth').val('');
  $('#printAllItems').prop('checked', true);
  
  // Show the modal
  $('#printInventoryModal').modal('show');
}

/**
 * Execute the print based on modal selections
 */
function executePrintInventory() {
  const fromDate = $('#printFromDate').val();
  const toDate = $('#printToDate').val();
  const selectedMonth = $('#printMonth').val();
  const printAll = $('#printAllItems').is(':checked');
  
  // If printing all or no date filter, use current data
  if (printAll || (!fromDate && !toDate && !selectedMonth)) {
    const data = table.rows({ search: 'applied' }).data().toArray();
    if (data.length === 0) {
      alert('No data to print');
      return;
    }
    $('#printInventoryModal').modal('hide');
    generatePrintReport(data, 'All Items (Current Inventory)');
    return;
  }
  
  // Build API URL for historical data
  let url = '/getInventoryHistory?';
  let reportPeriod = '';
  
  if (fromDate && toDate) {
    url += `startDate=${fromDate}&endDate=${toDate}`;
    reportPeriod = `${fromDate} to ${toDate}`;
  } else if (selectedMonth) {
    url += `month=${selectedMonth}`;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    reportPeriod = `${monthNames[parseInt(selectedMonth) - 1]} ${new Date().getFullYear()}`;
  }
  
  // Fetch historical data from server
  $.ajax({
    url: url,
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.success && response.data && response.data.length > 0) {
        $('#printInventoryModal').modal('hide');
        generatePrintReport(response.data, reportPeriod);
      } else {
        // No historical data found - fallback to current data with note
        const currentData = table.rows({ search: 'applied' }).data().toArray();
        if (currentData.length > 0) {
          $('#printInventoryModal').modal('hide');
          generatePrintReport(currentData, reportPeriod + ' (Current Data)');
        } else {
          alert('No data to print');
        }
      }
    },
    error: function() {
      // On error, fallback to current data
      const currentData = table.rows({ search: 'applied' }).data().toArray();
      if (currentData.length > 0) {
        $('#printInventoryModal').modal('hide');
        generatePrintReport(currentData, reportPeriod + ' (Current Data)');
      } else {
        alert('No data to print');
      }
    }
  });
}

/**
 * Generate and display the print report
 */
function generatePrintReport(data, reportPeriod) {
  // Close the modal
  $('#printInventoryModal').modal('hide');

  // Get current user info for print header
  let userRole = 'Unknown';
  let userFullName = 'Unknown';
  
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

  // Calculate summary stats
  let inStock = 0, forReorder = 0, outOfStock = 0;
  data.forEach(row => {
    const status = row.status || '';
    if (status === 'In Stock') inStock++;
    else if (status === 'For Reorder') forReorder++;
    else if (status === 'Out of Stock') outOfStock++;
  });

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Inventory Report</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 15px; }
        .header h1 { margin: 0; color: #2c5282; }
        .header p { margin: 5px 0; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; font-size: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background: #2c5282; color: #fff; }
        tr:nth-child(even) { background: #f9f9f9; }
        .summary { margin-bottom: 15px; font-size: 12px; }
        .summary span { margin-right: 30px; }
        .footer { margin-top: 30px; font-size: 11px; }
        .signature-line { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature-box { width: 200px; text-align: center; }
        .signature-box .line { border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>IMMACARE CLINIC</h1>
        <p>Inventory Report</p>
        <p><strong>Report Period:</strong> ${reportPeriod}</p>
      </div>
      <div class="meta">
        <div>
          <strong>Total Items:</strong> ${data.length}<br><br>
          <span><strong>In Stock:</strong> ${inStock}</span>
          <span><strong>For Reorder:</strong> ${forReorder}</span>
          <span><strong>Out of Stock:</strong> ${outOfStock}</span>
        </div>
        <div>
          <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
          <strong>Role:</strong> ${userRole}<br>
          <strong>Full Name:</strong> ${userFullName}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Unit</th>
            <th>Beginning</th>
            <th>Adjustments</th>
            <th>Actual Stock</th>
            <th>Qty Used</th>
            <th>Qty Wasted</th>
            <th>ABL</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              <td>${row.item || ''}</td>
              <td>${row.category || ''}</td>
              <td>${row.unit || ''}</td>
              <td>${row.beginning_balance || 0}</td>
              <td>${row.adjustments || 0}</td>
              <td>${row.actual_stock || 0}</td>
              <td>${row.qty_used || 0}</td>
              <td>${row.qty_wasted || 0}</td>
              <td>${row.abl || 0}</td>
              <td>${row.price || 0}</td>
              <td>${row.status || ''}</td>
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

// Handle inline status change
$(document).on("change", ".status-select", function () {
  const id = $(this).data("id");
  const newStatus = $(this).val();
  const selectElement = $(this);

  $.ajax({
    url: "/updateInventoryStatus",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ id, status: newStatus }),
    success: function (response) {
      // Update the select styling
      selectElement.removeClass('status-in-stock status-out-of-stock status-for-reorder');
      if (newStatus === 'In Stock') {
        selectElement.addClass('status-in-stock');
      } else if (newStatus === 'Out of Stock') {
        selectElement.addClass('status-out-of-stock');
      } else if (newStatus === 'For Reorder') {
        selectElement.addClass('status-for-reorder');
      }
    },
    error: function (xhr) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: xhr.responseJSON?.message || "Failed to update status.",
      });
      table.ajax.reload();
    },
  });
});

// Handle inline category change
$(document).on("change", ".category-select", function () {
  const id = $(this).data("id");
  const newCategory = $(this).val();

  $.ajax({
    url: "/updateInventoryCategory",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ id, category: newCategory }),
    success: function (response) {
      // Silent success
    },
    error: function (xhr) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: xhr.responseJSON?.message || "Failed to update category.",
      });
      table.ajax.reload();
    },
  });
});

// Handle delete item
$(document).on("click", ".delete-item-btn", function () {
  const id = $(this).data("id");

  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this item? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    backdrop: false,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/deleteInventoryItem/${id}`,
        method: "DELETE",
        success: function (response) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Item has been deleted successfully.",
          });
          table.ajax.reload();
        },
        error: function (xhr) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: xhr.responseJSON?.message || "Failed to delete item.",
          });
        },
      });
    }
  });
});

// Handle inline field edit (on blur)
$(document).on("blur", ".inline-edit", function () {
  const id = $(this).data("id");
  const field = $(this).data("field");
  const value = $(this).val();

  $.ajax({
    url: "/updateInventoryField",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ id, field, value }),
    success: function (response) {
      // Reload to update calculated fields
      table.ajax.reload(null, false);
    },
    error: function (xhr) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: xhr.responseJSON?.message || "Failed to update field.",
      });
      table.ajax.reload();
    },
  });
});

// inventory.js (inside $(document).ready function)

// let table;
// $(document).re.ady(function () {
//   table = $("#inventoryTable").DataTable({
//     columns: [
//       { data: "item" },
//       { data: "category" },
//       { data: "unit" },
//       { data: "beginning_balance" },
//       { data: "adjustments" },
//       { data: "total_available" },
//       { data: "actual_stock" },
//       { data: "qty_used" },
//       { data: "qty_wasted" },
//       { data: "months_usage" },
//       { data: "abl" },
//       { data: "qty_required" },
//       { data: "stock" },
//       { data: "ending_balance" },
//       { data: "price" },
//       {
//         data: "status",
//         render: function (data, type, row) {
//           let statusClass =
//             data.toLowerCase() === "out of stock"
//               ? "badge bg-danger"
//               : data.toLowerCase() === "in stock"
//               ? "badge bg-success"
//               : "badge bg-secondary";
//           return `<span class="${statusClass}">${data}</span>`;
//         },
//       },
//       {
//         data: null,
//         orderable: false,
//         searchable: false,
//         render: function (data, type, row) {
//           return `<button class="btn btn-warning btn-sm get-item-btn" data-bs-toggle="modal" data-bs-target="#updateItem" data-bs-backdrop="false" data-id="${row.id}">Update Item</button>`;
//         },
//       },
//     ],

//     columnDefs: [{ targets: 1, width: "10%" }],

//     searching: false,
//     lengthChange: false,
//     dom: "Bfrtip",
//     buttons: ["excel", "pdf"],
//     responsive: true,
//     ajax: {
//       url: "/getInventory",
//       dataSrc: "data",
//       data: function (d) {
//         d.item = $("#itemSearch").val();
//         d.status = $("#ItemStatus").val();
//       },
//     },
//   });

//   $("#ItemStatus").on("change", function () {
//     table.ajax.reload();
//   });

//   // The rest of your existing JS functions (saveItem, searchInventory, etc.) follow here...
// });


























