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
const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember-me');

// Check if already logged in
const token = localStorage.getItem('token');
if (token) {
  console.log("User already logged in, skipping login.");
  // window.location.href = "dashboard.html"; // Uncomment for redirect
}

// PREFILL email if Remember Me was checked
const savedEmail = localStorage.getItem('rememberedEmail');
if (savedEmail) {
  emailInput.value = savedEmail;
  rememberCheckbox.checked = true;
}

// LOGIN BUTTON CLICK
loginBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validation
  if (!email || !password) {
    showNotification("Please fill all fields!", "warning");
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showNotification("Please enter a valid email!", "error");
    return;
  }

  // Show spinner
  spinner.style.display = 'flex';

  // Simulate server check
  setTimeout(() => {
    spinner.style.display = 'none';

    if (email === "test@gmail.com" && password === "123456") {
      showNotification("Login successful ✅", "success");
      localStorage.setItem('token', 'demo-token');

      // Save email only if Remember Me is checked
      if (rememberCheckbox.checked) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // window.location.href = "dashboard.html"; // redirect
    } else {
      showNotification("Invalid email or password ❌", "error");
    }
  }, 2000);
});