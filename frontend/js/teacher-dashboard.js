// ✅ Check session on page load
(async () => {
  const res = await fetch("http://localhost:5000/api/auth/check", {
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok || !data.user) {
    // 🔁 If no session, redirect to login
    alert("Session expired. Please log in again.");
    window.location.href = "login.html";
  }
})();


const quizList = document.getElementById('quizList');

async function loadQuizzes() {
  const res = await fetch('http://localhost:5000/api/quiz/all', {
    credentials: 'include'
  });

  const data = await res.json();

  if (res.ok) {
    quizList.innerHTML = '<h3>Your Quizzes</h3>';
    data.quizzes.forEach(quiz => {
      const div = document.createElement('div');
      div.innerHTML = `
        <p><strong>${quiz.title}</strong> - ${quiz.description} (⏱️ ${quiz.time_limit} mins)</p>
        <button onclick="window.location.href='quiz-results.html?quizId=${quiz.id}'">📊 View Submissions</button>
        <hr>
      `;
      quizList.appendChild(div);
    });
  } else {
    alert("Failed to load quizzes");
  }
}

function logout() {
  fetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
    credentials: "include"
  })
    .then((res) => res.json())
    .then((data) => {
      alert("✅ Logged out successfully!");
      window.location.href = "login.html";
    })
    .catch((err) => {
      console.error("Logout error:", err);
      alert("❌ Error logging out.");
    });
}

// 🔄 Reload page if loaded from back/forward cache
window.addEventListener("pageshow", (event) => {
  if (event.persisted || (window.performance && performance.getEntriesByType("navigation")[0].type === "back_forward")) {
    window.location.reload();
  }
});
