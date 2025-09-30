// =========================
// ✅ Notification function
// =========================
function showNotification(message, type = "info") {
  let notify = document.getElementById("notify");
  if (!notify) {
    notify = document.createElement("div");
    notify.id = "notify";
    notify.className = "notification";
    document.body.appendChild(notify);
  }
  notify.textContent = message;
  notify.className = `notification ${type} show`;
  setTimeout(() => {
    notify.classList.remove("show");
  }, 3000);
}

// =========================
// Toggle password visibility
// =========================
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

// =========================
// Keep page stable on focus
// =========================
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("focus", () => {
    setTimeout(() => {
      const rect = input.getBoundingClientRect();
      const visible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!visible) input.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
  });
});

// =========================
// Elements
// =========================
const spinner = document.getElementById('spinner');
const signupBtn = document.getElementById('signup-btn');
const signupForm = document.querySelector('.signup-container');
const verificationForm = document.getElementById('verification-form');
const userEmailSpan = document.getElementById('user-email');
const verifyBtn = document.getElementById('verify-btn');
const codeInputs = document.querySelectorAll('.code-input');
const resendLink = document.getElementById('resend-code');

let resendTimer = null;

// =========================
// Check token
// =========================
const token = localStorage.getItem('token');
if (token) {
  console.log('Token found, skipping signup/login.');
  // window.location.href = "dashboard.html";
}

// =========================
// API BASE URL
// =========================
const API_BASE = "https://signup-backend-co2x.onrender.com"; // main backend
const WORKER_BASE = "https://signup-backend-1-ouct.onrender.com"; // worker server if needed

// =========================
// SIGNUP BUTTON CLICK
// =========================
signupBtn.addEventListener('click', async () => {
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

  try {
    // Call backend signup
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password })
    });
    const data = await res.json();
    spinner.style.display = 'none';

    if (data.success) {
      signupForm.style.display = 'none';
      verificationForm.style.display = 'block';
      userEmailSpan.textContent = email;
      codeInputs[0].focus();
      startResendCountdown();
      showNotification("Verification code sent to your email 📩", "info");
    } else {
      showNotification(data.message || "Signup failed!", "error");
    }
  } catch (err) {
    spinner.style.display = 'none';
    console.error(err);
    showNotification("Network error, try again!", "error");
  }
});

// =========================
// AUTO-FOCUS for verification code inputs
// =========================
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

// =========================
// VERIFY BUTTON CLICK
// =========================
verifyBtn.addEventListener('click', async () => {
  const code = Array.from(codeInputs).map(i => i.value).join('');
  if (code.length < 6) {
    showNotification("Enter the full 6-digit code!", "warning");
    return;
  }

  spinner.style.display = 'flex';
  try {
    const res = await fetch(`${API_BASE}/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmailSpan.textContent, code })
    });
    const data = await res.json();
    spinner.style.display = 'none';

    if (data.success) {
      showNotification("Verification successful ✅ Account activated!", "success");
      localStorage.setItem('token', data.token); // permanent token
      // window.location.href = "dashboard.html";
    } else {
      showNotification(data.message || "Invalid code!", "error");
    }
  } catch (err) {
    spinner.style.display = 'none';
    console.error(err);
    showNotification("Network error, try again!", "error");
  }
});

// =========================
// RESEND CODE CLICK WITH 20-SECOND COUNTDOWN
// =========================
function startResendCountdown() {
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

// =========================
// RESEND LINK CLICK
// =========================
resendLink.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const email = userEmailSpan.textContent;
    await fetch(`${API_BASE}/resend-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    showNotification("New verification code sent 📩", "info");
    startResendCountdown();
  } catch (err) {
    console.error(err);
    showNotification("Network error, try again!", "error");
  }
});