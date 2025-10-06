let secretNumber, attempts, gameOver, startTime;
const maxAttempts = 10;
let gamesPlayed = Number(localStorage.getItem("gamesPlayed")) || 0;
let bestScore = Number(localStorage.getItem("bestScore")) || null;

function initGame() {
  secretNumber = Math.floor(Math.random() * 50) + 1;
  attempts = 0;
  gameOver = false;
  startTime = new Date();

  document.getElementById("result").textContent = "";
  document.getElementById("hint").textContent = "";
  document.getElementById("logBody").innerHTML = "";
  document.getElementById("gameInfo").innerHTML = "";
  document.getElementById("guessInput").value = "";
  document.getElementById("guessInput").disabled = false;
  document.getElementById("submitBtn").disabled = false;
  document.getElementById("gamesPlayed").textContent = gamesPlayed;
  document.getElementById("bestScore").textContent = bestScore || "-";
}

function makeGuess() {
  if (gameOver) return;

  const inputEl = document.getElementById("guessInput");
  const guessValue = inputEl.value.trim();
  const resultDiv = document.getElementById("result");
  const hintDiv = document.getElementById("hint");
  const logBody = document.getElementById("logBody");

  if (!guessValue || isNaN(guessValue) || guessValue < 1 || guessValue > 50) {
    resultDiv.style.color = "red";
    resultDiv.textContent = "⚠ Please enter a valid number (1–50).";
    return;
  }

  const guess = Number(guessValue);
  attempts++;
  let result = "";

  if (guess === secretNumber) {
    result = "🎉 Correct!";
    resultDiv.style.color = "green";
    resultDiv.textContent = `✅ Correct 🎉 You guessed in ${attempts} tries!`;
    endGame(true);
  } else if (guess < secretNumber) {
    result = "Too Low ❌";
    resultDiv.style.color = "orange";
    resultDiv.textContent = "Too Low ❌ Try again!";
  } else {
    result = "Too High ❌";
    resultDiv.style.color = "orange";
    resultDiv.textContent = "Too High ❌ Try again!";
  }

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${attempts}</td>
    <td>${guess}</td>
    <td>${result}</td>
    <td>${new Date().toLocaleTimeString()}</td>
  `;
  if (guess === secretNumber) row.style.backgroundColor = "#c8f7c5";
  logBody.appendChild(row);

  // Give a hint after 5 attempts
  if (!gameOver && attempts === 5) {
    const range = 5;
    let minHint = Math.max(1, secretNumber - range);
    let maxHint = Math.min(50, secretNumber + range);
    hintDiv.textContent = `💡 Hint: The number is between ${minHint} and ${maxHint}.`;
  }

  // Check for game over
  if (!gameOver && attempts >= maxAttempts) {
    resultDiv.style.color = "red";
    resultDiv.textContent = `❌ Game Over! You used ${maxAttempts} attempts. The secret number was ${secretNumber}.`;
    endGame(false);
  }

  inputEl.value = "";
  inputEl.focus();
}

function endGame(won) {
  gameOver = true;
  document.getElementById("guessInput").disabled = true;
  document.getElementById("submitBtn").disabled = true;

  const endTime = new Date();
  document.getElementById("gameInfo").innerHTML = `
    <p>Game Started: ${startTime.toLocaleString()}</p>
    <p>Game Finished: ${endTime.toLocaleString()}</p>
  `;

  gamesPlayed++;
  localStorage.setItem("gamesPlayed", gamesPlayed);
  document.getElementById("gamesPlayed").textContent = gamesPlayed;

  if (won) {
    if (!bestScore || attempts < bestScore) {
      bestScore = attempts;
      localStorage.setItem("bestScore", bestScore);
    }
    document.getElementById("bestScore").textContent = bestScore;
  }
}

function restartGame() {
  initGame();
}

document.getElementById("submitBtn").addEventListener("click", makeGuess);
document.getElementById("guessInput").addEventListener("keyup", (e) => {
  if (e.key === "Enter") makeGuess();
});

window.onload = initGame;
