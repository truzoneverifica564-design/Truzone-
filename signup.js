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

  // Validation
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    alert("Please fill all fields!");
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Please enter a valid email!");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Show spinner
  spinner.style.display = 'flex';

  // Simulate server delay and show verification
  setTimeout(() => {
    spinner.style.display = 'none';
    signupForm.style.display = 'none';
    verificationForm.style.display = 'block';
    userEmailSpan.textContent = email;
    codeInputs[0].focus();
    startResendCountdown();
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
    alert("Enter the full 6-digit code.");
    return;
  }

  spinner.style.display = 'flex';
  setTimeout(() => {
    spinner.style.display = 'none';
    alert("Verification successful! Account activated.");
    localStorage.setItem('token', 'demo-token');
    // window.location.href = "dashboard.html";
  }, 2000);
});

// RESEND CODE CLICK WITH 20-SECOND COUNTDOWN
let countdown = 20;
function startResendCountdown() {
  resendLink.style.pointerEvents = 'none';
  resendLink.textContent = `Resend (${countdown}s)`;

  const timer = setInterval(() => {
    countdown--;
    resendLink.textContent = `Resend (${countdown}s)`;
    if (countdown <= 0) {
      clearInterval(timer);
      resendLink.textContent = "Resend";
      resendLink.style.pointerEvents = 'auto';
      countdown = 10; // reset for next time
    }
  }, 1000);
}

resendLink.addEventListener('click', (e) => {
  e.preventDefault();
  alert("Verification code resent to your email!");
  startResendCountdown();
});