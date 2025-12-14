document.getElementById("createQuizForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const time_limit = document.getElementById("timeLimit").value;

  // Send POST request to backend
  const res = await fetch(`${API_CONFIG.QUIZ}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, description, time_limit })
  });

  const data = await res.json();

  if (res.ok) {
    // ✅ Redirect to add-questions.html with quizId in query param
    const quizId = data.quiz_id;
    alert("✅ Quiz created! Now add questions.");
    window.location.href = `add-questions.html?quizId=${quizId}`;
  } else {
    alert(data.msg || "❌ Error creating quiz");
  }
});
