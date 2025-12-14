const quizId = new URLSearchParams(window.location.search).get("quizId");

async function loadResults() {
  const tbody = document.querySelector("#resultsTable tbody");
  const titleBox = document.getElementById("quizTitle");

  // 1. Get leaderboard
  try {
    const res = await fetch(`${API_CONFIG.QUIZ}/${quizId}/leaderboard`, {
      credentials: "include"
    });
    const data = await res.json();

    console.log("📊 Leaderboard response:", data);

    if (res.ok) {
      tbody.innerHTML = "";

      if (data.leaderboard.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3'>No submissions yet.</td></tr>";
      } else {
        data.leaderboard.forEach((row) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.score}</td>
            <td>${new Date(row.submitted_at).toLocaleString()}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    } else {
      alert(data.msg || "❌ Error fetching leaderboard");
    }
  } catch (err) {
    console.error("❌ Error loading leaderboard:", err);
    alert("Failed to fetch leaderboard.");
  }

  // 2. Fetch quiz title (optional)
  try {
    const titleRes = await fetch(`${API_CONFIG.QUIZ}/all`, { credentials: "include" });
    const titleData = await titleRes.json();

    if (titleRes.ok) {
      const quiz = titleData.quizzes.find(q => q.id == quizId);
      if (quiz) {
        titleBox.innerHTML = `<h3>${quiz.title}</h3>`;
      } else {
        titleBox.innerHTML = `<h3>Quiz #${quizId}</h3>`;
      }
    }
  } catch (err) {
    console.warn("Could not fetch quiz title");
  }
}

loadResults();
