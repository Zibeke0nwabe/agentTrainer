const endCallButton = document.getElementById('end-call-button');
const callLog = document.getElementById('call-log');

function endCall() {
  alert('End Call button was clicked! ✅'); 

  if (recognition) {
    console.log('Stopping recognition...');
    recognition.stop();
  }

  callContainer.style.display = 'none';

  const transcript = getCallTranscript();

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
    .then(response => response.json())
    .then(data => {
      const evaluationResults = data.feedback;
      window.location.href = `/end.html?evaluationResults=${encodeURIComponent(evaluationResults)}`;
    })
    .catch(error => {
      console.error('Error during evaluation:', error);
      alert("An error occurred while processing the evaluation.");
    });
}

function getCallTranscript() {
  return Array.from(callLog.children).map(log => log.innerText);
}

function getSessionId() {
  return localStorage.getItem('sessionId') || 'default-session-id';
}

if (endCallButton) {
  console.log('End call button is attached');
  endCallButton.addEventListener('click', endCall);
} else {
  console.log('❌ No end-call button found!');
}