

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ signup.js is loaded!");

  const signupForm = document.getElementById("signup-form");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const toggleConfirmPasswordBtn = document.getElementById(
    "toggleConfirmPassword"
  );
  const birthdateInput = document.getElementById("birthdate");
  const ageInput = document.getElementById("age");
  const phoneInput = document.getElementById("phone"); // Phone Input
  const emailInput = document.getElementById("email");

  // --- CONSTANTS FOR VALIDATION ---
  const PHONE_PREFIX = "+639";
  const PHONE_MIN_LENGTH = 13; // +639 (4 chars) + 9 digits = 13 total
  // --- Utility Functions ---
  function capitalizeEachWord(str) {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function isAllUppercase(str) {
    return str === str.toUpperCase() && /[A-Z]/.test(str);
  }

  const setupPasswordToggle = (inputElement, toggleButton) => {
    if (inputElement && toggleButton) {
      toggleButton.addEventListener("click", function () {
        const type =
          inputElement.getAttribute("type") === "password"
            ? "text"
            : "password";
        inputElement.setAttribute("type", type);

        // Toggle the icon classes
        const icon = this.querySelector("i");
        if (icon) {
          icon.classList.toggle("bi-eye");
          icon.classList.toggle("bi-eye-slash");
        }
      });
    }
  };

  setupPasswordToggle(passwordInput, togglePasswordBtn);
  setupPasswordToggle(confirmPasswordInput, toggleConfirmPasswordBtn);

  // --- REALTIME PASSWORD VALIDATION ---
  const reqLength = document.getElementById('req-length');
  const reqUppercase = document.getElementById('req-uppercase');
  const reqNumber = document.getElementById('req-number');
  const reqSpecial = document.getElementById('req-special');
  const passwordMatch = document.getElementById('password-match');
  const passwordRequirements = document.getElementById('password-requirements');

  function updateRequirement(element, isValid, text) {
    if (isValid) {
      element.classList.remove('invalid');
      element.classList.add('valid');
      element.textContent = '✓ ' + text;
    } else {
      element.classList.remove('valid');
      element.classList.add('invalid');
      element.textContent = '✗ ' + text;
    }
  }

  function validatePasswordRealtime() {
    const password = passwordInput ? passwordInput.value : '';
    
    // Check each requirement
    updateRequirement(reqLength, password.length >= 8, 'At least 8 characters');
    updateRequirement(reqUppercase, /[A-Z]/.test(password), 'At least 1 uppercase letter');
    updateRequirement(reqNumber, /[0-9]/.test(password), 'At least 1 number');
    updateRequirement(reqSpecial, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), 'At least 1 special character');
    
    // Also check password match if confirm password has value
    validatePasswordMatch();
  }

  function validatePasswordMatch() {
    const password = passwordInput ? passwordInput.value : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
    
    if (confirmPassword.length === 0) {
      passwordMatch.textContent = '';
      passwordMatch.classList.remove('valid', 'invalid');
    } else if (password === confirmPassword) {
      passwordMatch.textContent = '✓ Passwords match';
      passwordMatch.classList.remove('invalid');
      passwordMatch.classList.add('valid');
    } else {
      passwordMatch.textContent = '✗ Passwords do not match';
      passwordMatch.classList.remove('valid');
      passwordMatch.classList.add('invalid');
    }
  }

  // Add event listeners for realtime validation
  if (passwordInput) {
    // Show requirements when user focuses on password field
    passwordInput.addEventListener('focus', function() {
      if (passwordRequirements) {
        passwordRequirements.style.display = 'block';
      }
    });
    
    passwordInput.addEventListener('input', validatePasswordRealtime);
    passwordInput.addEventListener('keyup', validatePasswordRealtime);
  }
  
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    confirmPasswordInput.addEventListener('keyup', validatePasswordMatch);
  }

  // --- MAIN FORM SUBMISSION AND VALIDATION ---
  if (signupForm && passwordInput && confirmPasswordInput && phoneInput) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Phone Number Length Validation
      if (phoneInput.value.length < PHONE_MIN_LENGTH) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Phone Number",
          text: "Please enter the full 9-digit mobile number after +639.",
        });
        phoneInput.focus();
        return; // Stop form submission
      }

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      const password = data.password ? data.password.trim() : "";
      const confirmPassword = data.confirmPassword
        ? data.confirmPassword.trim()
        : "";

      // 2. 🔑 Password Strength Validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        Swal.fire({
          icon: "error",
          title: "Weak Password",
          html: `Password must contain:<br>
            • At least 8 characters<br>
            • At least 1 uppercase letter<br>
            • At least 1 number<br>
            • At least 1 special character (!@#$%^&* etc.)`,
        });
        passwordInput.focus();
        return; // Stop form submission
      }

      // 3. 🔑 Password Mismatch Validation
      if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch",
          text: "Your passwords do not match. Please try again.",
        });
        confirmPasswordInput.value = "";
        confirmPasswordInput.focus();
        return; // Stop form submission
      }

      // 4. API Submission (If all validations pass)
      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          // Registration successful - show verification message
          Swal.fire({
            title: "Registration Successful!",
            icon: "success",
            html: `
              <p>${result.message || "Your account has been created successfully."}</p>
              ${result.emailSent !== false ? `
                <p style="margin-top: 15px; font-weight: bold; color: #007bff;">
                  📧 A verification email has been sent to your email address.
                </p>
                <p style="margin-top: 10px; font-size: 14px;">
                  Please check your inbox and click the verification link to activate your account.
                </p>
                <p style="margin-top: 10px; font-size: 12px; color: #666;">
                  Didn't receive the email? Check your spam folder or 
                  <a href="#" id="resendVerification" style="color: #007bff; text-decoration: underline;">
                    click here to resend
                  </a>.
                </p>
              ` : `
                <p style="margin-top: 15px; color: #dc3545;">
                  ⚠️ Verification email could not be sent. Please contact support.
                </p>
              `}
            `,
            confirmButtonText: "Go to Login",
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((swalResult) => {
            if (swalResult.isConfirmed) {
              window.location.href = "/login";
            }
          });

          // Handle resend verification link click
          setTimeout(() => {
            const resendLink = document.getElementById("resendVerification");
            if (resendLink) {
              resendLink.addEventListener("click", async (e) => {
                e.preventDefault();
                const email = emailInput.value.trim().toLowerCase();

                try {
                  const resendResponse = await fetch("/resend-verification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                  });

                  const resendResult = await resendResponse.json();

                  Swal.fire({
                    icon: resendResponse.ok ? "success" : "error",
                    title: resendResponse.ok ? "Email Sent!" : "Error",
                    text: resendResult.message
                  });
                } catch (error) {
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to resend verification email. Please try again later."
                  });
                }
              });
            }
          }, 100);
        } else {
          // Registration failed
          Swal.fire({
            title: "Registration Failed",
            icon: "error",
            text: result.message || "Please check your form and try again."
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong while submitting the form. Check your network.",
        });
        console.error("Error:", error);
      }
    });
  }

  // --- Age Calculation Logic ---
  const today = new Date().toISOString().split("T")[0];
  if (birthdateInput) {
    birthdateInput.setAttribute("max", today);
    birthdateInput.addEventListener("change", () => {
      const birthdateValue = birthdateInput.value;
      if (!birthdateValue || !ageInput) {
        ageInput.value = "";
        return;
      }
      const birthDate = new Date(birthdateValue);
      const todayDate = new Date();
      let age = todayDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = todayDate.getMonth() - birthDate.getMonth();
      const dayDiff = todayDate.getDate() - birthDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }
      ageInput.value = age < 1 ? "" : age;
    });
  }

  // --- Name Formatting and Special Character Block ---
  const nameFields = ["firstName", "middleName", "lastName"];
  nameFields.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", () => {
        let value = input.value;
        if (isAllUppercase(value)) {
          value = value.toLowerCase();
        }
        value = capitalizeEachWord(value);
        input.value = value.replace(/[^A-Za-z ]/g, "");
      });

      input.addEventListener("keydown", function (event) {
        const allowedKeys = [
          "Backspace",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
          "Delete",
          " ",
        ];
        if (!allowedKeys.includes(event.key) && !event.key.match(/[A-Za-z]/)) {
          event.preventDefault();
        }
      });
    }
  });

  // --- Phone Number Formatting ---
  if (phoneInput) {
    phoneInput.addEventListener("focus", () => {
      if (!phoneInput.value.startsWith(PHONE_PREFIX)) {
        phoneInput.value = PHONE_PREFIX;
      }
    });
    phoneInput.addEventListener("input", () => {
      if (!phoneInput.value.startsWith(PHONE_PREFIX)) {
        const numbersOnly = phoneInput.value.replace(/\D/g, "");
        phoneInput.value = PHONE_PREFIX + numbersOnly.replace(/^639?/, "");
      }
      // Truncate to max length to prevent users from typing too many numbers
      if (phoneInput.value.length > PHONE_MIN_LENGTH) {
        phoneInput.value = phoneInput.value.substring(0, PHONE_MIN_LENGTH);
      }
    });
    phoneInput.addEventListener("keydown", (e) => {
      if (
        phoneInput.selectionStart <= PHONE_PREFIX.length &&
        (e.key === "Backspace" || e.key === "ArrowLeft")
      ) {
        e.preventDefault();
      }
    });
  }

  // --- Email Formatting ---
  if (emailInput) {
    emailInput.addEventListener("input", () => {
      let value = emailInput.value.trim();
      const atIndex = value.indexOf("@");

      emailInput.value = value.toLowerCase();

      if (atIndex === -1) {
        return;
      }

      const local = value.slice(0, atIndex);
      const domain = value.slice(atIndex);
      const requiredDomain = "@gmail.com";

      // Simple attempt to auto-correct domain if user only typed part of it
      if (domain.length <= 1) {
        emailInput.value = local + requiredDomain;
      } else if (!domain.startsWith(requiredDomain)) {
        // This is a common pattern for specific domain enforcement
        // You might want to remove this if other email domains are allowed
        emailInput.value = local + requiredDomain;
      }
    });

    emailInput.addEventListener("blur", () => {
      let value = emailInput.value.trim().toLowerCase();

      if (value && value.indexOf("@") === -1) {
        emailInput.value = value + "@gmail.com";
      }
    });
  }
});
// me
