let table;

$(document).ready(function () {
  table = $("#patientTable").DataTable({
    columnDefs: [
      { targets: 1, width: "10%" },
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
          return `
        <button
          class="btn btn-warning btn-sm get-user-btn"
          data-bs-toggle="modal"
          data-bs-target="#updateModal"
          data-bs-backdrop="false"
          data-user-id="${row.user_id}"
        >
          Update
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
});

$(document).on("click", ".get-user-btn", function () {
  const userId = $(this).data("user-id");
  $("#modal_user_id").val(userId);
  
  $.ajax({
    url: `/users_update/${userId}`,
    method: "GET",
    success: function (response) {
      const user = response.data[0];

      // Populate input fields
      $("#firstname").val(user.firstname);
      $("#middlename").val(user.middlename);
      $("#lastname").val(user.lastname);
      $("#birthdate").val(user.birthdate);
      $("#gender").val(user.gender);
      $("#email").val(user.username);
      $("#status").val(user.status);
      $("#password, #passwordconfirm").val("");
    },
    error: function () {
      alert("Failed to load patient");
    },
  });
});

function updatePatient() {
  const user_id = $("#modal_user_id").val();
  const email = $("#email").val();
  const password = $("#password").val();
  const passwordConfirm = $("#passwordconfirm").val();
  const status = $("#status").val();

  // Validate password match if password is being changed
  if (password && password !== passwordConfirm) {
    Swal.fire({
      title: "Error",
      text: "Passwords do not match.",
      icon: "error",
    });
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to update this patient account?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    confirmButtonText: "Yes, update!",
    backdrop: false,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/updateUserAccount",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ user_id, email, password, status }),
        success: function (response) {
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Patient account has been updated successfully.",
          }).then(() => {
            $("#updateModal").modal("hide");
            $(".updateInput").val("");
            table.ajax.reload();
          });
        },
        error: function (xhr) {
          Swal.fire({
            title: "Error!",
            text: xhr.responseJSON?.message || "Failed to update patient.",
            icon: "error",
          });
        },
      });
    }
  });
}

function clearCriteria() {
  $(".criteria").val("");
  table.ajax.reload();
}

function searchPatient() {
  table.ajax.reload();
}
