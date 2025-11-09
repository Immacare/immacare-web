fetch('http://localhost:3000/homepage', {
  method: 'GET',
  credentials: 'include' // This is crucial for session/cookie-based auth
})
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw new Error(err.message); });
    }
    return response.json();
  })
  .then(data => {
    // Display username in the div
    })
  .catch(error => {
    console.error('Error:', error.message);

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
  

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.help-button').forEach(button => {
    button.addEventListener('click', () => {
      const targetPage = button.getAttribute('data-nav');
      window.location.href = targetPage;
    });
  });
});


