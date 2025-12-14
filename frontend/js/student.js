// ✅ Check session on page load - TEMPORARILY DISABLED FOR DEPLOYMENT
// (async () => {
//   const res = await fetch(`${API_CONFIG.AUTH}/check`, {
//     credentials: "include"
//   });

//   const data = await res.json();
//   if (!res.ok || !data.user) {
//     // 🔁 If no session, redirect to login
//     alert("Session expired. Please log in again.");
//     window.location.href = "login.html";
//   }
// })();


const quizList = document.getElementById("quizList");

async function loadQuizzes() {
  const res = await fetch(`${API_CONFIG.QUIZ}/all`, {
    credentials: "include"
  });

  const data = await res.json();
  if (res.ok) {
    data.quizzes.forEach(quiz => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${quiz.title}</strong> - ${quiz.description}
        <button onclick="startQuiz(${quiz.id})">Attempt</button>
      `;
      quizList.appendChild(li);
    });
  } else {
    alert("Failed to load quizzes");
  }
}

function startQuiz(quizId) {
  window.location.href = `quiz.html?quizId=${quizId}`;
}

// Logout handler
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_CONFIG.AUTH}/logout`, {
      method: "POST",
      credentials: "include"
    });
    const data = await res.json();
    alert("✅ Logged out successfully!");
    window.location.href = "login.html";
  } catch (err) {
    console.error("Logout error:", err);
    alert("❌ Error logging out.");
  }
});



loadQuizzes();

// 🔄 Reload page if loaded from back/forward cache
window.addEventListener("pageshow", (event) => {
  if (event.persisted || (window.performance && performance.getEntriesByType("navigation")[0].type === "back_forward")) {
    window.location.reload();
  }
});
