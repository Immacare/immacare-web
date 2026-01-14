$(document).ready(function () { });

// Route mapping: URL path -> iframe content path
const routeMap = {
  '/dashboard': '../dashboard/dashboard.html',
  '/home': '../homepage/homepage.html',
  '/appointment_booking': '../appointment_booking/appointment_booking.html',
  '/appointment_list': '../appointment_booking/appointment_list.html',
  '/patient': '../patient/patient_profile.html',
  '/patient_profile': '../patient/patient_profile.html',
  '/patient_list': '../patient_list/patient_list.html',
  '/doctor': '../doctor/doctors_list.html',
  '/doctors_list': '../doctor/doctors_list.html',
  '/doctors_profile': '../doctor/doctors_profile.html',
  '/doctor_schedule': '../doctor/doctor_schedule.html',
  '/inventory': '../inventory/inventory.html',
  '/pos': '../pos/pos.html',
  '/user_access': '../user_access/user_access.html',
  '/users_account': '../users_account/users_account.html',
  '/analytics': '../analytics/analytics.html',
  '/doctor_analytics': '../analytics/doctor_analytics.html',
  '/audit_logs': '../audit_logs/audit_logs.html',
  '/financial_report': '../financial_report/financial_report.html',
  '/header_menu': '../homepage/homepage.html'
};

// Reverse mapping: iframe path -> URL path (for updating URL when iframe loads)
const reverseRouteMap = {};
Object.keys(routeMap).forEach(key => {
  const iframePath = routeMap[key];
  // Use the first matching route for each iframe path
  if (!reverseRouteMap[iframePath]) {
    reverseRouteMap[iframePath] = key;
  }
});

// Get the iframe content path from current URL
function getIframePathFromUrl() {
  const path = window.location.pathname;
  return routeMap[path] || '../homepage/homepage.html';
}

// Get the URL path from iframe content path
function getUrlFromIframePath(iframePath) {
  // Normalize the path for comparison
  const normalizedPath = iframePath.replace(/^\.\.\//, '../');
  return reverseRouteMap[normalizedPath] || '/dashboard';
}

document.addEventListener("DOMContentLoaded", function () {
  const iframe = document.getElementById("main-content-frame");
  
  // Load content based on current URL path instead of localStorage
  const iframePath = getIframePathFromUrl();
  iframe.src = iframePath;
});

function loadPage(pageUrl, updateHistory = true) {
  const iframe = document.getElementById("main-content-frame");
  iframe.src = pageUrl;
  localStorage.setItem("lastIframePage", pageUrl);
  
  // Update browser URL using History API
  if (updateHistory) {
    const newUrl = getUrlFromIframePath(pageUrl);
    if (newUrl && window.location.pathname !== newUrl) {
      window.history.pushState({ iframePath: pageUrl }, '', newUrl);
    }
  }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.iframePath) {
    loadPage(event.state.iframePath, false);
  } else {
    // Fallback: get iframe path from URL
    const iframePath = getIframePathFromUrl();
    const iframe = document.getElementById("main-content-frame");
    if (iframe) {
      iframe.src = iframePath;
    }
  }
  
  // Update active nav link
  updateActiveNavLink();
});

// Update active nav link based on current URL
function updateActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");
  
  navLinks.forEach(function (nav) {
    nav.classList.remove("active");
    
    // Check if this nav link's onclick matches current path
    const onclickAttr = nav.getAttribute('onclick');
    if (onclickAttr) {
      const match = onclickAttr.match(/loadPage\(['"]([^'"]+)['"]\)/);
      if (match) {
        const iframePath = match[1];
        const urlPath = getUrlFromIframePath(iframePath);
        if (urlPath === currentPath) {
          nav.classList.add("active");
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      // Remove 'active' class from all links
      navLinks.forEach(function (nav) {
        nav.classList.remove("active");
      });

      // Add 'active' class to the clicked link
      this.classList.add("active");
    });
  });
  
  // Set initial active state based on URL
  updateActiveNavLink();
});
document.addEventListener("DOMContentLoaded", function () {
  fetch("/homepage", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message);
        });
      }
      return response.json();
    })
    .then((data) => {
      // Display user name
      document.getElementById(
        "usernameDisplay"
      ).textContent = `${data.firstname} ${data.lastname}`;

      $("#role").val(`${data.role}`);

      const patient = "patient",
        admin = "admin",
        doctor = "doctor",
        staff = "staff";

      // Hide 'home' if not patient or doctor
      if (![patient].includes(data.role)) {
        const homeEl = document.getElementById("home");
        if (homeEl) homeEl.style.display = "none";
      }
      // Only set default dashboard for non-patients if URL is /header_menu (no specific page)
      // This preserves URL-based routing when user navigates to specific pages
      if (data.role !== patient && window.location.pathname === '/header_menu') {
        const mainFrame = document.getElementById("main-content-frame");
        if (mainFrame) {
          mainFrame.src = "../dashboard/dashboard.html";
          // Update URL to reflect the dashboard
          window.history.replaceState({ iframePath: '../dashboard/dashboard.html' }, '', '/dashboard');
        }
      }
      if (data.role !== patient) {
        const myProfilePatient = document.getElementById("myProfilePatient");
        if (myProfilePatient) myProfilePatient.style.display = "none";
      }
      if (data.role !== doctor) {
        const myProfileDoctor = document.getElementById("myProfileDoctor");
        if (myProfileDoctor) myProfileDoctor.style.display = "none";
      }
      if (data.role !== admin) {
        const userAccess = document.getElementById("userAccess");
        if (userAccess) userAccess.style.display = "none";
        const patientList = document.getElementById("patientList");
        if (patientList) patientList.style.display = "none";
      }

      // Dashboard: show only for doctor, admin, staff
      if (![doctor, admin, staff].includes(data.role)) {
        const dashboard = document.getElementById("dashboard");
        if (dashboard) dashboard.style.display = "none";
      }

      // Inventory: show only for admin and staff (not doctor)
      if (![admin, staff].includes(data.role)) {
        const inventory = document.getElementById("inventory");
        if (inventory) inventory.style.display = "none";
      }

      // POS: show only for admin and staff
      if (![admin, staff].includes(data.role)) {
        const pos = document.getElementById("pos");
        if (pos) pos.style.display = "none";
      }

      // Audit Logs: show only for admin
      if (data.role !== admin) {
        const auditLogs = document.getElementById("auditLogs");
        if (auditLogs) auditLogs.style.display = "none";
      }

      // Book Appointment: hide for doctor, admin, staff
      if ([doctor, admin, staff].includes(data.role)) {
        const bookAppointment = document.getElementById("bookAppointment");
        if (bookAppointment) bookAppointment.style.display = "none";
      }

      // Hide Doctors, Inventory, Financial if NOT admin or staff
      if (![admin, staff].includes(data.role)) {
        const doctors = document.getElementById("doctors");
        if (doctors) doctors.style.display = "none";
        const finance = document.getElementById("finance");
        if (finance) finance.style.display = "none";
        const patients = document.getElementById("patients");
        if (patients) patients.style.display = "none";
      }

      // Hide Analytics (admin version) if NOT admin
      if (data.role !== admin) {
        const analytics = document.getElementById("analytics");
        if (analytics) analytics.style.display = "none";
      }

      // Hide Doctor Analytics if NOT doctor
      if (data.role !== doctor) {
        const doctorAnalytics = document.getElementById("doctorAnalytics");
        if (doctorAnalytics) doctorAnalytics.style.display = "none";
      }

      // Hide Doctor Schedule if NOT doctor
      if (data.role !== doctor) {
        const doctorSchedule = document.getElementById("doctorSchedule");
        if (doctorSchedule) doctorSchedule.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
      const usernameDisplay = document.getElementById("usernameDisplay");
      if (usernameDisplay) {
        usernameDisplay.textContent = error.message || "Error loading user data";
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      // Remove 'active' class from all links
      navLinks.forEach(function (nav) {
        nav.classList.remove("active");
      });

      // Add 'active' class to the clicked link
      this.classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();

      fetch("/logout", {
        method: "POST",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Logged out successfully") {
            window.location.href = "/landingpage";
          } else {
            alert("Logout failed: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Logout error:", error);
          alert("An error occurred during logout.");
        });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const iframe = document.getElementById("myIframe");
  if (iframe) {
    iframe.onload = function () {
      iframe.style.height =
        iframe.contentWindow.document.body.scrollHeight + "px";
    };
  }
});
