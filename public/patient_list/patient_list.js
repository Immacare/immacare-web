let table;

$(document).ready(function () {
  table = $("#patientTable").DataTable({
    columnDefs: [
      { targets: 1, width: "15%" },
      {
        targets: [0], // Index of column to hide (0-based)
        visible: false,
      },
    ],
    responsive: true,
    lengthChange: false,
    searching: false,
    ajax: {
      url: "/patients",
      dataSrc: "data",
      data: function (d) {
        d.fullname = $("#fullname").val();
      },
    },
    columns: [
      { data: "user_id" },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          const isActive = row.status === "Active" || row.status === true || row.status === 1;
          const btnClass = isActive ? "btn-danger" : "btn-success";
          const btnText = isActive ? "Disable" : "Enable";
          const btnIcon = isActive ? "bi-person-x" : "bi-person-check";
          return `
        <button
          class="btn btn-info btn-sm get-user-btn me-1"
          data-bs-toggle="modal"
          data-bs-target="#updateModal"
          data-bs-backdrop="false"
          data-user-id="${row.user_id}"
        >
          View Patient Info
        </button>
        <button
          class="btn ${btnClass} btn-sm toggle-status-btn"
          data-user-id="${row.user_id}"
          data-status="${isActive}"
          onclick="togglePatientStatus('${row.user_id}', ${isActive})"
        >
          <i class="bi ${btnIcon}"></i> ${btnText}
        </button>
      `;
        },
      },
      { data: "fullname" },
      { data: "status" },
      { data: "username" },
      { data: "updated_date" },
    ],
  });

  $(".dt-length label").each(function () {
    const labelText = $(this).text().trim();
    if (labelText === "entries per page") {
      $(this).remove();
    }
  });

  // Reset to first tab when modal is closed
  $("#updateModal").on("hidden.bs.modal", function () {
    $("#info-tab").tab("show");
  });
});

$(document).on("click", ".get-user-btn", function () {
  const userId = $(this).data("user-id");
  $("#modal_user_id").val(userId);
  
  // Load patient information
  loadPatientInfo(userId);
  
  // Load appointment history
  loadAppointmentHistory(userId);
  
  // Load recommendations
  loadRecommendations(userId);
});

function loadPatientInfo(userId) {
  $.ajax({
    url: `/users_update/${userId}`,
    method: "GET",
    success: function (response) {
      const user = response.data[0];

      // Populate input fields
      $("#firstname").val(user.firstname || "N/A");
      $("#middlename").val(user.middlename || "N/A");
      $("#lastname").val(user.lastname || "N/A");
      $("#birthdate").val(user.birthdate || "N/A");
      $("#gender").val(user.gender || "N/A");
      $("#email").val(user.username || "N/A");
      $("#status").val(user.status || "N/A");
      $("#mobile").val(user.mobile_number || "N/A");
      $("#age").val(user.age || "N/A");
      $("#address").val(user.home_address || "N/A");
    },
    error: function () {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load patient information.",
      });
    },
  });
}

function loadAppointmentHistory(userId) {
  const tbody = $("#appointmentHistoryBody");
  tbody.empty();
  $("#noAppointmentHistory").hide();
  $("#appointmentHistoryTable").show();

  $.ajax({
    url: `/getPatientAppointmentHistory/${userId}`,
    method: "GET",
    success: function (response) {
      if (response.data && response.data.length > 0) {
        response.data.forEach(function (appointment) {
          tbody.append(`
            <tr>
              <td>${appointment.booking_date || "N/A"}</td>
              <td>${appointment.booking_time || "N/A"}</td>
              <td>${appointment.consultation_type || "N/A"}</td>
              <td>${appointment.doctor_name || "Not Assigned"}</td>
              <td><span class="badge ${getStatusBadgeClass(appointment.status)}">${appointment.status || "N/A"}</span></td>
            </tr>
          `);
        });
      } else {
        $("#appointmentHistoryTable").hide();
        $("#noAppointmentHistory").show();
      }
    },
    error: function () {
      $("#appointmentHistoryTable").hide();
      $("#noAppointmentHistory").show();
    },
  });
}

function loadRecommendations(userId) {
  const tbody = $("#recommendationsBody");
  tbody.empty();
  $("#noRecommendations").hide();
  $("#recommendationsTable").show();

  $.ajax({
    url: `/getPatientRecommendations/${userId}`,
    method: "GET",
    success: function (response) {
      if (response.data && response.data.length > 0) {
        response.data.forEach(function (rec) {
          tbody.append(`
            <tr>
              <td>${rec.date || "N/A"}</td>
              <td>${rec.doctor_name || "N/A"}</td>
              <td>${rec.recommendation || "N/A"}</td>
            </tr>
          `);
        });
      } else {
        $("#recommendationsTable").hide();
        $("#noRecommendations").show();
      }
    },
    error: function () {
      $("#recommendationsTable").hide();
      $("#noRecommendations").show();
    },
  });
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "Completed":
      return "bg-success";
    case "Cancelled":
      return "bg-danger";
    case "In Queue":
      return "bg-warning text-dark";
    case "Booked":
      return "bg-primary";
    case "Emergency":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

function clearCriteria() {
  $(".criteria").val("");
  table.ajax.reload();
}

function searchPatient() {
  table.ajax.reload();
}

// Toggle patient account status (enable/disable)
function togglePatientStatus(userId, currentStatus) {
  const action = currentStatus ? "disable" : "enable";
  const newStatus = !currentStatus;
  
  Swal.fire({
    title: `${currentStatus ? "Disable" : "Enable"} Account?`,
    text: `Are you sure you want to ${action} this patient's account?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: currentStatus ? "#dc3545" : "#28a745",
    cancelButtonColor: "#6c757d",
    confirmButtonText: `Yes, ${action} it!`,
    backdrop: false
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/togglePatientStatus",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          user_id: userId,
          status: newStatus
        }),
        success: function(response) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: `Account has been ${action}d successfully.`,
            timer: 2000,
            showConfirmButton: false
          });
          table.ajax.reload();
        },
        error: function(xhr) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: xhr.responseJSON?.message || `Failed to ${action} account.`
          });
        }
      });
    }
  });
}
