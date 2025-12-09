$(document).ready(function () {});
document.addEventListener("DOMContentLoaded", function () {
  const iframe = document.getElementById("main-content-frame");
  const lastPage =
    localStorage.getItem("lastIframePage") || "../homepage/homepage.html";
  iframe.src = lastPage;
});

function loadPage(pageUrl) {
  const iframe = document.getElementById("main-content-frame");
  iframe.src = pageUrl;
  localStorage.setItem("lastIframePage", pageUrl);
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
});

function loadPage(url) {
  document.getElementById("main-content-frame").src = url;
}
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/homepage", {
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
      if (data.role !== patient) {
        const mainFrame = document.getElementById("main-content-frame");
        if (mainFrame) {
          mainFrame.src = "../dashboard/dashboard.html";
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
      }

      // Dashboard: show only for doctor, admin, staff
      if (![doctor, admin, staff].includes(data.role)) {
        const dashboard = document.getElementById("dashboard");
        if (dashboard) dashboard.style.display = "none";

        const inventory = document.getElementById("inventory");
        if (inventory) inventory.style.display = "none";
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

      // Hide Analytics if NOT admin only
      if (data.role !== admin) {
        const analytics = document.getElementById("analytics");
        if (analytics) analytics.style.display = "none";
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
            window.location.href = "../landingpage/landingpage.html";
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
