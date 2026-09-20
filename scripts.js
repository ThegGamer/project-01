document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  // Handle Contact Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Simulate API request processing
    status.style.color = "#60a5fa";
    status.textContent = "Sending message...";

    setTimeout(() => {
      status.style.color = "#34d399";
      status.textContent = "Thank you! Your message has been received.";
      form.reset();
    }, 1200);
  });
});
