// ✅ Step 1: Get quizId from URL and verify it
const quizId = new URLSearchParams(window.location.search).get("quizId");

if (!quizId) {
  alert("Quiz ID missing. Redirecting to Create Quiz page.");
  window.location.href = "create-quiz.html";
}

document.getElementById("quizIdInfo").innerText = `Quiz ID: ${quizId}`;

// ✅ Step 2: Add question submission logic
document.getElementById("questionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = document.getElementById("question").value.trim();
  const option_a = document.getElementById("optA").value.trim();
  const option_b = document.getElementById("optB").value.trim();
  const option_c = document.getElementById("optC").value.trim();
  const option_d = document.getElementById("optD").value.trim();
  const correct_option = document.getElementById("correctOption").value;

  const res = await fetch("http://localhost:5000/api/quiz/add-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      quiz_id: quizId,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option
    })
  });

  const data = await res.json();
  if (res.ok) {
    alert("✅ Question added!");
    document.getElementById("questionForm").reset();
  } else {
    alert(data.msg || "❌ Error adding question");
  }
});

// ✅ Step 3: Optional — Done button to finish adding questions
document.getElementById("doneBtn").addEventListener("click", () => {
  alert("All questions added!");
  window.location.href = "create-quiz.html"; // or "teacher.html" if you build one
});
