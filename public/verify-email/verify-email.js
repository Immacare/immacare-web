/**
 * Email Verification Page Script
 * 
 * PURPOSE:
 * Handles email verification when user clicks verification link from email
 */

document.addEventListener("DOMContentLoaded", function () {
  const loadingState = document.getElementById("loadingState");
  const successState = document.getElementById("successState");
  const errorState = document.getElementById("errorState");
  const errorMessage = document.getElementById("errorMessage");
  const resendBtn = document.getElementById("resendBtn");

  // Get token and verified status from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const alreadyVerified = urlParams.get("verified") === "true";
  const alreadyWasVerified = urlParams.get("already") === "true";
  const hasError = urlParams.get("error");

  // If already verified (redirected from API), show success immediately
  if (alreadyVerified) {
    const message = alreadyWasVerified 
      ? "Email already verified. You can now log in."
      : "Email verified successfully! You can now log in.";
    showSuccess(message);
    return;
  }

  // If error parameter present, show error
  if (hasError === "invalid") {
    showError("Invalid or expired verification token. Please request a new verification email.");
    return;
  }
  
  if (hasError === "notfound") {
    showError("User account not found. Please contact support.");
    return;
  }

  if (!token) {
    showError("Verification token is missing. Please check your email and click the verification link again.");
    return;
  }

  // Verify email on page load
  verifyEmail(token);

  /**
   * Verify email address using token
   */
  async function verifyEmail(token) {
    try {
      const response = await fetch(`/verify-email?token=${encodeURIComponent(token)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message);
      } else {
        showError(result.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      showError("An error occurred while verifying your email. Please try again later.");
    }
  }

  /**
   * Show success state
   */
  function showSuccess(message) {
    loadingState.style.display = "none";
    errorState.style.display = "none";
    successState.style.display = "block";
    
    // Auto-redirect countdown
    let countdown = 5;
    const countdownElement = document.getElementById("countdown");
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdownElement) {
        countdownElement.textContent = countdown;
      }
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        window.location.href = "../login/login.html";
      }
    }, 1000);
  }

  /**
   * Show error state
   */
  function showError(message) {
    loadingState.style.display = "none";
    successState.style.display = "none";
    errorState.style.display = "block";
    errorMessage.textContent = message;
  }

  /**
   * Handle resend verification email
   */
  if (resendBtn) {
    resendBtn.addEventListener("click", async function () {
      const email = prompt("Please enter your email address:");
      
      if (!email) {
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Email",
          text: "Please enter a valid email address."
        });
        return;
      }

      try {
        const response = await fetch("/resend-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: email.toLowerCase() })
        });

        const result = await response.json();

        Swal.fire({
          icon: response.ok ? "success" : "error",
          title: response.ok ? "Email Sent!" : "Error",
          text: result.message
        });
      } catch (error) {
        console.error("Resend error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to resend verification email. Please try again later."
        });
      }
    });
  }
});

