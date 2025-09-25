// ✅ Notification function
function showNotification(message, type = "info") {
  let notify = document.getElementById("notify");

  // Create element if not exist
  if (!notify) {
    notify = document.createElement("div");
    notify.id = "notify";
    notify.className = "notification";
    document.body.appendChild(notify);
  }

  notify.textContent = message;
  notify.className = `notification ${type} show`;

  // Auto hide after 3s
  setTimeout(() => {
    notify.classList.remove("show");
  }, 3000);
}

// Toggle password visibility
function togglePassword(id, el) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    el.textContent = "Hide";
  } else {
    input.type = "password";
    el.textContent = "Show";
  }
}

// Keep page stable when input focused
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("focus", () => {
    setTimeout(() => {
      const rect = input.getBoundingClientRect();
      const visible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!visible) input.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
  });
});

const spinner = document.getElementById('spinner');
const signupBtn = document.getElementById('signup-btn');
const signupForm = document.querySelector('.signup-container');
const verificationForm = document.getElementById('verification-form');
const userEmailSpan = document.getElementById('user-email');
const verifyBtn = document.getElementById('verify-btn');
const codeInputs = document.querySelectorAll('.code-input');
const resendLink = document.getElementById('resend-code');

let resendTimer = null; // store interval timer

// Simulate token check
const token = localStorage.getItem('token');
if (token) {
  console.log('Token found, skipping signup/login.');
  // window.location.href = "dashboard.html";
}

// SIGNUP BUTTON CLICK
signupBtn.addEventListener('click', () => {
  const firstName = document.querySelector("input[placeholder='First Name']").value.trim();
  const lastName = document.querySelector("input[placeholder='Last Name']").value.trim();
  const email = document.querySelector("input[placeholder='Email']").value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showNotification("Please fill all fields!", "warning");
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showNotification("Please enter a valid email!", "error");
    return;
  }
  if (password !== confirmPassword) {
    showNotification("Passwords do not match!", "error");
    return;
  }

  spinner.style.display = 'flex';

  setTimeout(() => {
    spinner.style.display = 'none';
    signupForm.style.display = 'none';
    verificationForm.style.display = 'block';
    userEmailSpan.textContent = email;
    codeInputs[0].focus();
    startResendCountdown();
    showNotification("Verification code sent to your email 📩", "info");
  }, 2000);
});

// AUTO-FOCUS for verification code inputs
codeInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (input.value.length === 1 && index < codeInputs.length - 1) {
      codeInputs[index + 1].focus();
    }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && index > 0 && input.value.length === 0) {
      codeInputs[index - 1].focus();
    }
  });
});

// VERIFY BUTTON CLICK
verifyBtn.addEventListener('click', () => {
  const code = Array.from(codeInputs).map(i => i.value).join('');
  if (code.length < 6) {
    showNotification("Enter the full 6-digit code!", "warning");
    return;
  }

  spinner.style.display = 'flex';
  setTimeout(() => {
    spinner.style.display = 'none';
    showNotification("Verification successful ✅ Account activated!", "success");
    localStorage.setItem('token', 'demo-token');
    // window.location.href = "dashboard.html";
  }, 2000);
});

// RESEND CODE CLICK WITH 20-SECOND COUNTDOWN
function startResendCountdown() {
  // Clear any previous timer
  if (resendTimer) clearInterval(resendTimer);

  let countdown = 20;
  resendLink.style.pointerEvents = 'none';
  resendLink.textContent = `Resend (${countdown}s)`;

  resendTimer = setInterval(() => {
    countdown--;
    resendLink.textContent = `Resend (${countdown}s)`;
    if (countdown <= 0) {
      clearInterval(resendTimer);
      resendLink.textContent = "Resend";
      resendLink.style.pointerEvents = 'auto';
    }
  }, 1000);
}

// Resend link click
resendLink.addEventListener('click', (e) => {
  e.preventDefault();
  showNotification("New verification code sent 📩", "info");
  startResendCountdown(); // restart countdown
});