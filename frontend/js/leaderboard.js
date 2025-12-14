const quizId = new URLSearchParams(window.location.search).get("quizId");
document.getElementById("quizInfo").innerText = `Quiz ID: ${quizId}`;

async function loadLeaderboard() {
  const res = await fetch(`${API_CONFIG.QUIZ}/${quizId}/leaderboard`, {
    credentials: "include"
  });
  const data = await res.json();

  const table = document.getElementById("leaderboardTable");
  if (res.ok && data.leaderboard.length > 0) {
    data.leaderboard.forEach((entry, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${entry.name}</td>
        <td>${entry.score}</td>
        <td>${new Date(entry.submitted_at).toLocaleString()}</td>
      `;
      table.appendChild(row);
    });
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4">No entries yet.</td>`;
    table.appendChild(row);
  }
}

loadLeaderboard();
