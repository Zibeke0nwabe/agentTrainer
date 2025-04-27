let timers = {};
let currentState = "Available";
let seconds = 0;

function formatTime(sec) {
    let hrs = Math.floor(sec / 3600).toString().padStart(2, "0");
    let mins = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    let secs = (sec % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
}

function startTimer(state) {
    clearInterval(timers[state]);
    seconds = 0;
    const timerElement = document.getElementById(`status-timer-${state}`);
    if (timerElement) {
        timerElement.innerText = "00:00:00";
        timers[state] = setInterval(() => {
            seconds++;
            timerElement.innerText = formatTime(seconds);
        }, 1000);
    }
}

function stopTimer(state) {
    clearInterval(timers[state]);
}

function setStatus() {
    const newStatus = document.getElementById("status-select").value;
    const statusText = document.getElementById("current-status");
    const leftSection = document.getElementById("left-section");
    const statusDiv = document.querySelector(".flex.items-center.space-x-4 .text-white.text-lg");

    stopTimer(currentState);
    statusText.innerText = newStatus;

    statusText.className = newStatus === "Available"
        ? "text-green-300 font-semibold"
        : newStatus === "In-Call" || newStatus === "Outbound"
            ? "text-yellow-300 font-semibold"
            : "text-red-300 font-semibold";

    if (newStatus === "In-Call" || newStatus === "Outbound") {
        leftSection.classList.remove("hidden");
    } else {
        leftSection.classList.add("hidden");
    }

    // Hide all timer spans
    Array.from(statusDiv.querySelectorAll('span[id^="status-timer-"]')).forEach(span => {
        span.style.display = 'none';
    });

    // Create timer if it doesn't exist and show it
    let timerElement = document.getElementById(`status-timer-${newStatus}`);
    if (!timerElement) {
        const timerSpan = document.createElement('span');
        timerSpan.id = `status-timer-${newStatus}`;
        timerSpan.textContent = '00:00:00';
        statusDiv.appendChild(timerSpan);
        timerElement = timerSpan;
    }
    timerElement.style.display = 'inline'; // Show the current timer

    startTimer(newStatus);
    currentState = newStatus;
}

// Function to toggle the keypad visibility
function toggleKeypad() {
    const keypad = document.getElementById("keypad-container");
    const callUI = document.getElementById("call-ui");
    keypad.classList.toggle("hidden");
    callUI.classList.toggle("hidden");
}

// Function to handle keypad input
function handleKeyPress(key) {
    let inputDisplay = document.getElementById("input-display");
    if (key === 'back') {
        inputDisplay.value = inputDisplay.value.slice(0, -1);
    } else if (key === 'delete') {
        inputDisplay.value = '';
    } else {
        inputDisplay.value += key;
    }
}

// Function to clear all numbers
function clearInput() {
    document.getElementById("input-display").value = '';
}

window.onload = () => {
    setStatus();
};

// Function to handle the "Back" button functionality
function handleBackButton() {
    const keypad = document.getElementById("keypad-container");
    const callUI = document.getElementById("call-ui");
    keypad.classList.add("hidden");
    callUI.classList.remove("hidden");
}

// Function to handle the "Delete" button functionality
function handleDeleteButton() {
    let inputDisplay = document.getElementById("input-display");
    inputDisplay.value = inputDisplay.value.slice(0, -1);
}

// Function to handle the "Clear" button functionality
function handleClearButton() {
    let inputDisplay = document.getElementById("input-display");
    inputDisplay.value = '';
}