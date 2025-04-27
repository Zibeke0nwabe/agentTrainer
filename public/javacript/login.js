const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

let attemptCount = 0;
let blockTime = null;

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  // Check if currently blocked
  const now = new Date().getTime();
  if (blockTime && now < blockTime) {
    const remaining = Math.ceil((blockTime - now) / 1000);
    errorMessage.textContent = `You are temporarily blocked. Try again in ${remaining} seconds.`;
    errorMessage.classList.remove('hidden');
    return;
  }

  // Proceed with the login request
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.href = '/home'; // Redirect to home page on success
      } else {
        attemptCount++; // Increment attempt count
        passwordInput.value = ''; // Clear password input for next attempt

        // Check if user has reached the maximum number of failed attempts
        if (attemptCount >= 3) {
          blockTime = new Date().getTime() + 5 * 60 * 1000; // Block for 5 minutes
          errorMessage.textContent = 'You have been blocked for 5 minutes due to multiple failed attempts.';
          errorMessage.classList.remove('hidden');
          startCountdown(); // Start countdown to show time remaining until unblock
        } else {
          errorMessage.textContent = 'Incorrect username or password. Please try again.';
          errorMessage.classList.remove('hidden');
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      errorMessage.textContent = 'Something went wrong. Please try again later.';
      errorMessage.classList.remove('hidden');
    });
});

// Function to start the countdown timer when the user is blocked
function startCountdown() {
  const interval = setInterval(() => {
    const now = new Date().getTime();
    if (now >= blockTime) {
      clearInterval(interval); // Stop the interval when the block time has passed
      errorMessage.classList.add('hidden'); // Hide the error message
      attemptCount = 0; // Reset attempt count
      blockTime = null; // Reset block time
    } else {
      const remaining = Math.ceil((blockTime - now) / 1000); // Calculate remaining block time
      errorMessage.textContent = `You are temporarily blocked. Try again in ${remaining} seconds.`;
    }
  }, 1000); // Update every second
}
