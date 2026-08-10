document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  // ---------- Contact form: field type restrictions ----------
  var nameField = document.getElementById("name");
  if (nameField) {
    nameField.addEventListener("input", function () {
      this.value = this.value.replace(/[^A-Za-z\s.'\-]/g, "");
    });
  }

  var phoneField = document.getElementById("phone");
  if (phoneField) {
    phoneField.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9+\-\s]/g, "");
    });
  }

  var budgetField = document.getElementById("budget");
  if (budgetField) {
    budgetField.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9₹.,\-\s]/g, "");
    });
  }
  // message field is intentionally unrestricted: free text and numbers allowed

  // ---------- Contact form: submit to Google Sheet, then redirect ----------
  // Paste your Google Apps Script Web App URL below (see setup instructions).
  var LEAD_FORM_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw-KcM2-EJugU0yeYUR3lsMgAlqxTuXss_thCPRiIAmculakflJsD6FYnDqzPrmtuP_xA/exec";

  var leadForm = document.getElementById("leadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var errorBox = document.getElementById("leadFormError");
      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        return;
      }

      var formData = new FormData(leadForm);
      var submitBtn = leadForm.querySelector("button[type=submit]");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      if (!LEAD_FORM_SCRIPT_URL) {
        // Sheet not connected yet, proceed to thank-you page without saving.
        window.location.href = "thankyou.html";
        return;
      }

      fetch(LEAD_FORM_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
      })
        .then(function () {
          window.location.href = "thankyou.html";
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Request";
          }
          if (errorBox) {
            errorBox.style.display = "block";
            errorBox.textContent = "Something went wrong sending your request. Please try again or email hello@hirelancer.agency directly.";
          }
        });
    });
  }
});
