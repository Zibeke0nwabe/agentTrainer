// voice.js

const startRecognitionButton = document.getElementById('start-recognition-button');
const callLog = []; // Store transcript for evaluation

let recognition;
let synth = window.speechSynthesis;
let selectedVoice;
let voices = [];

// Load voices and set default voice
function loadVoices() {
  voices = synth.getVoices();
  if (voices.length > 0) selectedVoice = voices[0];
}
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// Speak AI response
function speak(text) {
  if (!selectedVoice) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onend = () => {
    startVoiceRecognition();
  };

  synth.speak(utterance);
  console.log(`Customer says: ${text}`);
}

// Start voice recognition for agent's speech
function startVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech Recognition is not supported in this browser.");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    startRecognitionButton.innerText = "Listening...";
  };

  recognition.onresult = async (event) => {
    const agentMessage = event.results[0][0].transcript.trim();
    if (agentMessage) {
      console.log(`Agent says: ${agentMessage}`);
      callLog.push({ speaker: "Agent", text: agentMessage }); // Add to transcript

      try {
        const response = await fetch('/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `message=${encodeURIComponent(agentMessage)}`,
        });

        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

        const data = await response.json();
        callLog.push({ speaker: "Customer", text: data.response }); // Add AI response to transcript
        speak(data.response);
      } catch (err) {
        console.error('Error:', err);
        speak("Sorry, I couldn't process your request.");
      }
    }
  };

  recognition.onspeechend = () => {
    recognition.stop();
    startRecognitionButton.innerText = "Start Talking";
  };

  recognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
    startRecognitionButton.innerText = "Start Talking";
  };

  recognition.start();
}

// Expose function to be called from HTML button
startRecognitionButton.addEventListener('click', () => {
  startVoiceRecognition();
});

// Function to get full transcript text for evaluation
function getCallTranscript() {
  return callLog.map(entry => `${entry.speaker}: ${entry.text}`).join('\n');
}

// Attach getCallTranscript globally so end.js can access it
window.getCallTranscript = getCallTranscript;
window.callLog = callLog;
window.recognition = recognition;
