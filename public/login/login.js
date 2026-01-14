/**
 * Login Page JavaScript
 * 
 * PURPOSE:
 * Handles user authentication for the web application. Manages login form submission,
 * password visibility toggle, and redirects authenticated users to the main application.
 * 
 * FUNCTIONALITY:
 * 1. Handles login form submission
 * 2. Sends credentials to /login API endpoint
 * 3. Creates session on successful login
 * 4. Redirects to header_menu.html on success
 * 5. Provides password visibility toggle functionality
 * 
 * API ENDPOINT:
 * - POST /login - Authenticates user and creates session
 */

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;
  document
    .getElementById("login-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault(); // prevent default form submission

      const email = document.querySelector('input[name="email"]').value;
      const password = document.querySelector(
        'input[name="password"]'
      ).value;

      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: password }),
        });

        const data = await res.json();

        if (res.ok) {
          // alert("Login successful!");
          window.location.href = "/dashboard";
        } else {
          // Check if verification is required
          if (res.status === 403 && data.requiresVerification) {
            // Show verification required message with option to resend
            if (typeof Swal !== 'undefined') {
              Swal.fire({
                icon: 'warning',
                title: 'Email Verification Required',
                html: `
                  <p>${data.message}</p>
                  <p style="margin-top: 15px;">Would you like us to resend the verification email?</p>
                `,
                showCancelButton: true,
                confirmButtonText: 'Resend Email',
                cancelButtonText: 'Cancel'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Resend verification email
                  fetch('/resend-verification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: data.email })
                  })
                    .then(res => res.json())
                    .then(result => {
                      Swal.fire({
                        icon: 'success',
                        title: 'Email Sent!',
                        text: result.message || 'Verification email has been sent. Please check your inbox.'
                      });
                    })
                    .catch(error => {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to resend verification email. Please try again later.'
                      });
                    });
                }
              });
            } else {
              alert(data.message);
            }
          } else {
            alert(data.message || "Login failed");
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong");
      }
    });

  try {
    const response = await fetch("/login", {
      // Make sure port matches your backend
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }), // send as email, password to match backend
    });

    const data = await response.json();

    if (response.ok) {

    } else {
      alert(data.message); // e.g., "Invalid credentials"
    }
  } catch (error) {
    alert("Error connecting to server");
    console.error(error);
  }
});
//mata
/**
 * Password Visibility Toggle
 * Purpose: Allow users to show/hide password while typing
 * 
 * Process:
 *   1. Waits for DOM to load
 *   2. Finds password input and toggle button elements
 *   3. Toggles password input type between 'password' and 'text'
 *   4. Updates eye icon to reflect current state (eye/eye-slash)
 */
document.addEventListener('DOMContentLoaded', function () {
  console.log("✅ login.js is loaded!");

  const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#password');

  console.log("togglePassword:", togglePassword);
  console.log("password:", password);

  if (togglePassword && password) {
    togglePassword.addEventListener('click', function () {
      // Toggle between password and text input types
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);

      // Update icon to reflect current visibility state
      this.innerHTML = type === 'password'
        ? '<i class="bi bi-eye"></i>'      // Show eye icon when password is hidden
        : '<i class="bi bi-eye-slash"></i>'; // Show eye-slash icon when password is visible
    });
  } else {
    console.error(" Element(s) not found. Check your IDs!");
  }
});