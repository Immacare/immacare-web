/**
 * Doctor Schedule Management JavaScript
 * Allows doctors to set their available dates and time slots
 */

let currentDate = new Date();
let selectedDate = null;
let doctorSchedules = {};
let currentScheduleId = null;

$(document).ready(function() {
  // Get doctor user ID from session
  fetchDoctorUserId();
  
  // Initialize time slot click handlers
  initTimeSlotHandlers();
});

function fetchDoctorUserId() {
  $.ajax({
    url: "/homepage",
    method: "GET",
    success: function(response) {
      if (response.user_id) {
        $("#doctorUserId").val(response.user_id);
        loadDoctorSchedules();
        renderCalendar();
      } else {
        Swal.fire("Error", "Could not get user information", "error");
      }
    },
    error: function() {
      Swal.fire("Error", "Failed to fetch user information", "error");
    }
  });
}

function initTimeSlotHandlers() {
  $(document).on("click", ".time-slot-badge", function() {
    $(this).toggleClass("selected unselected");
  });
}

function loadDoctorSchedules() {
  const doctorId = $("#doctorUserId").val();
  if (!doctorId) return;
  
  $.ajax({
    url: "/doctor-schedules",
    method: "GET",
    data: { doctorId: doctorId },
    success: function(response) {
      if (response.success) {
        doctorSchedules = {};
        response.data.forEach(schedule => {
          doctorSchedules[schedule.scheduleDate] = schedule;
        });
        renderCalendar();
      }
    },
    error: function() {
      console.error("Failed to load schedules");
    }
  });
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Update header
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  $("#currentMonthYear").text(`${monthNames[month]} ${year}`);
  
  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get today for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let html = '';
  let dayCount = 1;
  
  // Create calendar rows
  for (let week = 0; week < 6; week++) {
    html += '<div class="row g-0">';
    
    for (let day = 0; day < 7; day++) {
      if ((week === 0 && day < firstDay) || dayCount > daysInMonth) {
        html += '<div class="col calendar-day"></div>';
      } else {
        const dateStr = formatDateForDB(year, month + 1, dayCount);
        const cellDate = new Date(year, month, dayCount);
        cellDate.setHours(0, 0, 0, 0);
        
        let classes = "col calendar-day";
        
        // Check if past date
        if (cellDate < today) {
          classes += " past";
        }
        
        // Check if today
        if (cellDate.getTime() === today.getTime()) {
          classes += " today";
        }
        
        // Check if has schedule
        if (doctorSchedules[dateStr]) {
          classes += " has-schedule";
        }
        
        // Check if selected
        if (selectedDate === dateStr) {
          classes += " selected";
        }
        
        const isPast = cellDate < today;
        html += `<div class="${classes}" data-date="${dateStr}" ${isPast ? '' : 'onclick="selectDate(\'' + dateStr + '\')"'}>
          <div class="fw-bold">${dayCount}</div>
          ${doctorSchedules[dateStr] ? '<small class="text-success"><i class="bi bi-check-circle"></i></small>' : ''}
        </div>`;
        
        dayCount++;
      }
    }
    
    html += '</div>';
    
    if (dayCount > daysInMonth) break;
  }
  
  $("#calendarGrid").html(html);
}

function formatDateForDB(year, month, day) {
  // Format: MM-DD-YYYY
  return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}-${year}`;
}

function selectDate(dateStr) {
  selectedDate = dateStr;
  
  // Update UI
  $(".calendar-day").removeClass("selected");
  $(`.calendar-day[data-date="${dateStr}"]`).addClass("selected");
  
  // Format for display
  const parts = dateStr.split('-');
  const displayDate = new Date(parts[2], parts[0] - 1, parts[1]);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  $("#selectedDate").val(displayDate.toLocaleDateString('en-US', options));
  
  // Load existing schedule if any
  if (doctorSchedules[dateStr]) {
    loadScheduleToForm(doctorSchedules[dateStr]);
    currentScheduleId = doctorSchedules[dateStr]._id;
    $("#deleteBtn").show();
  } else {
    resetForm();
    currentScheduleId = null;
    $("#deleteBtn").hide();
  }
}

function loadScheduleToForm(schedule) {
  // Reset all time slots
  $(".time-slot-badge").removeClass("selected").addClass("unselected");
  
  // Select saved time slots
  if (schedule.timeSlots && schedule.timeSlots.length > 0) {
    schedule.timeSlots.forEach(slot => {
      $(`.time-slot-badge[data-time="${slot}"]`).removeClass("unselected").addClass("selected");
    });
  }
  
  $("#isAvailable").prop("checked", schedule.isAvailable !== false);
}

function resetForm() {
  $(".time-slot-badge").removeClass("selected").addClass("unselected");
  $("#isAvailable").prop("checked", true);
}

function getSelectedTimeSlots() {
  const slots = [];
  $(".time-slot-badge.selected").each(function() {
    slots.push($(this).data("time"));
  });
  return slots;
}

function saveSchedule() {
  const doctorId = $("#doctorUserId").val();
  
  if (!selectedDate) {
    Swal.fire("Warning", "Please select a date first", "warning");
    return;
  }
  
  const timeSlots = getSelectedTimeSlots();
  
  if (timeSlots.length === 0 && $("#isAvailable").is(":checked")) {
    Swal.fire("Warning", "Please select at least one time slot", "warning");
    return;
  }
  
  const scheduleData = {
    doctorId: doctorId,
    scheduleDate: selectedDate,
    timeSlots: timeSlots,
    isAvailable: $("#isAvailable").is(":checked")
  };
  
  $.ajax({
    url: "/doctor-schedule",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(scheduleData),
    success: function(response) {
      if (response.success) {
        Swal.fire("Success", "Schedule saved successfully!", "success");
        loadDoctorSchedules();
      } else {
        Swal.fire("Error", response.message || "Failed to save schedule", "error");
      }
    },
    error: function(xhr) {
      Swal.fire("Error", xhr.responseJSON?.message || "Failed to save schedule", "error");
    }
  });
}

function deleteSchedule() {
  if (!currentScheduleId) {
    Swal.fire("Warning", "No schedule to delete", "warning");
    return;
  }
  
  Swal.fire({
    title: "Delete Schedule?",
    text: "Are you sure you want to delete this schedule?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/doctor-schedule/${currentScheduleId}`,
        method: "DELETE",
        success: function(response) {
          if (response.success) {
            Swal.fire("Deleted!", "Schedule has been deleted.", "success");
            resetForm();
            currentScheduleId = null;
            $("#deleteBtn").hide();
            loadDoctorSchedules();
          } else {
            Swal.fire("Error", response.message || "Failed to delete schedule", "error");
          }
        },
        error: function(xhr) {
          Swal.fire("Error", xhr.responseJSON?.message || "Failed to delete schedule", "error");
        }
      });
    }
  });
}

function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}
