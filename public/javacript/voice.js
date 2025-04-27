const preCallContainer = document.getElementById('pre-call-container');
const callContainer = document.getElementById('call-container');
const callLog = document.getElementById('call-log');
const startCallButton = document.getElementById('start-call-button');
const startRecognitionButton = document.getElementById('start-recognition-button');
const voiceSelect = document.getElementById('voice-select');

let synth = window.speechSynthesis;
let voices = [];
let selectedVoice;
let recognition;
let listening = false; // Flag to manage when to start listening

// Load available voices and populate the dropdown
function loadVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = '';

  // Add all available voices to the dropdown
  voices.forEach((voice, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  // Set the default voice to the first available voice
  if (voices.length > 0) {
    selectedVoice = voices[0];
  }
}

// Start the call
function startCall() {
  const selectedIndex = voiceSelect.value;
  selectedVoice = voices[selectedIndex];

  if (!selectedVoice) {
    alert("Please select a voice before starting the call.");
    return;
  }

  // Hide the pre-call container and show the call container
  preCallContainer.style.display = 'none';
  callContainer.style.display = 'flex';

  // Start voice recognition after the call starts
  startVoiceRecognition();
}

// Speak function for AI (customer)
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.rate = 1;
  utterance.pitch = 1;
  synth.speak(utterance);

  // Log the AI's message to the console instead of the call log
  console.log(`Customer says: ${text}`);

  // After AI speaks, start listening for the agent again
  utterance.onend = function () {
    startVoiceRecognition();
  };
}

// Start speech recognition to capture the agent's voice
function startVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech Recognition is not supported in this browser.");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // Start the voice recognition
  if (!listening) {
    recognition.start();
    listening = true;
    startRecognitionButton.innerText = "Listening...";
  }

  recognition.onstart = () => {
    startRecognitionButton.innerText = "Listening...";
  };

  recognition.onspeechend = () => {
    recognition.stop();
    listening = false;
    startRecognitionButton.innerText = "Start Talking";
  };

  recognition.onresult = async (event) => {
    const agentMessage = event.results[0][0].transcript.trim();

    if (agentMessage) {
      // Log the agent's message to the console
      console.log(`Agent says: ${agentMessage}`);

      // Send the agent's voice message to the server and get the AI's response
      try {
        const response = await fetch('/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `message=${encodeURIComponent(agentMessage)}`,
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        speak(data.response); // AI responds by speaking
      } catch (error) {
        console.error('Error sending message:', error);
        speak("Sorry, I couldn't process your request. Please try again.");
      }
    }
  };

  recognition.onerror = (event) => {
    cconsole.error('Speech Recognition Error:', event.error);
    const error2 = event.error;
    speak(error2);
  };
}

// Load voices when the page loads
window.speechSynthesis.onvoiceschanged = loadVoices;

// Initial load of voices (in case the voiceschanged event doesn't fire)
setTimeout(loadVoices, 1000);