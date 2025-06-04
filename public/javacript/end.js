// end.js

// Global variable to hold the recognition instance and transcript
let recognition = window.recognition; // Make sure this is accessible from voice.js
let callTranscript = [];

// Function to add agent's speech to transcript
function addToTranscript(text, speaker = "Agent") {
  callTranscript.push({ speaker, text });
}

// Function to get full transcript text
function getCallTranscript() {
  return callTranscript.map(entry => `${entry.speaker}: ${entry.text}`).join('\n');
}

// Dummy getSessionId function, replace with your actual implementation
function getSessionId() {
  return "session123"; // Or retrieve from wherever you store it
}

// Call this function on End Call button click
function endCall() {
  alert('End Call button was clicked! ✅');

  // Stop speech recognition if active
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {
      console.warn('Recognition stop error:', e);
    }
  }

  // Hide call container (make sure this element exists in voice.html)
  const callContainer = document.getElementById('call-container');
  if (callContainer) {
    callContainer.style.display = 'none';
  }

  // Get transcript text (if any)
  const transcript = getCallTranscript();

  if (!transcript || transcript.trim().length < 20) {
    // Consider less than 20 chars as a short/no call
    window.location.href = `/evaluate?evaluationResults=${encodeURIComponent('No evaluation available. You did not take the call or call was too short.')}`;
    return;
  }

  // Send transcript to server for evaluation
  fetch('/evaluate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcript: transcript,
      sessionId: getSessionId(),
    }),
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return response.json();
    })
    .then(data => {
      const evaluationResults = data.feedback || "No feedback available.";

      // Redirect to evaluation results page with feedback in query string
      window.location.href = `/evaluate?evaluationResults=${encodeURIComponent(evaluationResults)}`;
    })
    .catch(error => {
      console.error('Error during evaluation:', error);
      alert("An error occurred while processing the evaluation.");
    });
}
