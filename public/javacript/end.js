function endCall() {
  alert('End Call button was clicked! ✅');

  // Stop speech recognition if it's active
  if (recognition) {
    console.log('Stopping recognition...');
    recognition.stop();
  }

  // Hide the call container (assuming you have a call container element)
  callContainer.style.display = 'none';

  // Get the call transcript (this might be empty if no call was taken)
  const transcript = getCallTranscript();

  if (transcript.length === 0) {
    // If there's no transcript, show the "no evaluation available" message and redirect
    window.location.href = `/evaluate?evaluationResults=${encodeURIComponent('No evaluation available. You did not take the call.')}`;
    return;
  }

  // Send the transcript to the server for evaluation
  fetch('/evaluate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcript: transcript,
      sessionId: getSessionId(), // Get session ID
    }),
  })
  .then(response => response.json())
  .then(data => {
    const evaluationResults = data.feedback;

    // Redirect to the /evaluate page and pass the evaluation feedback
    window.location.href = `/evaluate?evaluationResults=${encodeURIComponent(evaluationResults)}`;
  })
  .catch(error => {
    console.error('Error during evaluation:', error);
    alert("An error occurred while processing the evaluation.");
  });
}
