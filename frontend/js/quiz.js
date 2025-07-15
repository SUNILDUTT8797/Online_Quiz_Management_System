const quizId = new URLSearchParams(window.location.search).get("quizId");
const quizForm = document.getElementById("quizForm");

let questions = [];
let warningShown = false;

// Full-screen helper functions
function goFullscreen() {
  const docElm = document.documentElement;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// Load quiz questions
async function loadQuiz() {
  const res = await fetch(`http://localhost:5000/api/quiz/${quizId}/questions`, {
    credentials: "include"
  });
  const data = await res.json();

  if (res.ok) {
    questions = data.questions;

    questions.forEach((q, i) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>Q${i + 1}:</strong> ${q.question}</p>
        <label><input type="radio" name="q${q.id}" value="a" required> A. ${q.option_a}</label><br>
        <label><input type="radio" name="q${q.id}" value="b"> B. ${q.option_b}</label><br>
        <label><input type="radio" name="q${q.id}" value="c"> C. ${q.option_c}</label><br>
        <label><input type="radio" name="q${q.id}" value="d"> D. ${q.option_d}</label><br><br>
      `;
      quizForm.appendChild(div);
    });

    // Enter full-screen mode
    goFullscreen();

  } else {
    alert("Failed to load quiz questions.");
  }
}


// Submit quiz and calculate score
document.getElementById("submitBtn").addEventListener("click", async () => {
  const answers = {};
  questions.forEach((q) => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    if (selected) {
      answers[q.id] = selected.value;
    }
  });

  const res = await fetch("http://localhost:5000/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quiz_id: quizId, answers })
  });

  const data = await res.json();
  if (res.ok) {
    alert(`You scored ${data.score}`);
    exitFullscreen();
    window.location.href = `leaderboard.html?quizId=${quizId}`;
  } else {
    alert(data.msg || "Error submitting quiz");
  }
});


// 🚨 Cheat Detection
// 1. Tab switching or minimizing
window.addEventListener("blur", () => {
  if (!warningShown) {
    alert("⚠️ You switched tabs or minimized the window. This is not allowed!");
    warningShown = true;
  }
});

// 2. Switching tab (visibility)
document.addEventListener("visibilitychange", () => {
  if (document.hidden && !warningShown) {
    alert("⚠️ Page lost focus. Stay on the quiz tab!");
    warningShown = true;
  }
});

// 3. Exiting full-screen
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && !warningShown) {
    alert("⚠️ You exited full-screen. Return or your quiz may be disqualified!");
    warningShown = true;
  }
});

// Run quiz loader
loadQuiz();
