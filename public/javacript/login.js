const correctUsername = "Onwabe";
const correctPassword = "Zibeke*";
let attemptCount = 0;
let blockTime = 0;
let countdownTimer;

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// Handle form submission
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Check if the user is blocked
  if (blockTime > 0) {
    const currentTime = new Date().getTime();
    if (currentTime < blockTime) {
      // Calculate remaining block time
      const remainingTime = Math.ceil((blockTime - currentTime) / 1000); // in seconds
      errorMessage.textContent = `You are blocked. Please try again in ${remainingTime} seconds.`;
      errorMessage.classList.remove('hidden');
      return;
    } else {
      blockTime = 0; // Reset block time if 5 minutes have passed
      errorMessage.classList.add('hidden');
    }
  }

  // Get user input values
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Validate username and password
  if (username === correctUsername && password === correctPassword) {
    window.location.href = "home.html"; // Redirect to home page if correct
  } else {
    attemptCount++;
    // Clear password input after incorrect login
    passwordInput.value = '';

    if (attemptCount >= 3) {
      blockTime = new Date().getTime() + 5 * 60 * 1000; // Block user for 5 minutes
      errorMessage.textContent = 'You have been blocked for 5 minutes due to multiple failed attempts.';
      errorMessage.classList.remove('hidden');
      startCountdown();
    } else {
      errorMessage.textContent = 'Incorrect username or password. Please try again.';
      errorMessage.classList.remove('hidden');
    }
  }
});

// Start countdown timer if blocked
function startCountdown() {
  if (countdownTimer) clearInterval(countdownTimer);

  countdownTimer = setInterval(() => {
    const currentTime = new Date().getTime();
    const remainingTime = Math.ceil((blockTime - currentTime) / 1000); // in seconds

    if (remainingTime <= 0) {
      clearInterval(countdownTimer);
      errorMessage.classList.add('hidden');
    } else {
      errorMessage.textContent = `You are blocked. Please try again in ${remainingTime} seconds.`;
    }
  }, 1000);
}
