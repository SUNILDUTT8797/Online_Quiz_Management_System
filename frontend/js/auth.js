// 📦 API base URL
const api = "http://localhost:5000/api/auth";

// ========================
// 👨‍🎓 Login Handler
// ========================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(`${api}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ for cookies/session
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Login successful!");

        // 🔁 Redirect based on user role
        if (data.user.role === 'faculty') {
          window.location.href = "teacher-dashboard.html";
        } else {
          window.location.href = "student.html";
        }
      } else {
        alert(data.msg || "❌ Login failed.");
      }

    } catch (err) {
      alert("❌ Error logging in. Please try again.");
      console.error("Login error:", err);
    }
  });
}

// ========================
// 📝 Register Handler
// ========================
const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    // 🔐 Domain restriction
    if (!email.endsWith('@ccet.ac.in')) {
      alert("Only @ccet.ac.in emails allowed!");
      return;
    }

    try {
      const res = await fetch(`${api}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ This was missing!
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registered successfully! Please login.");
        window.location.href = "login.html";
      } else {
        alert(data.msg || "❌ Registration failed.");
      }

    } catch (err) {
      alert("❌ Error during registration.");
      console.error("Register error:", err);
    }
  });
}
