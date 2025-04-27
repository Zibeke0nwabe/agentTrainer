let mediaRecorder;
let recordedChunks = [];

// Start screen recording
async function startScreenRecording() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true // Request audio capture as well
        });

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => {
            recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            const videoUrl = URL.createObjectURL(blob);
            localStorage.setItem("recordedVideoUrl", videoUrl); // Save video URL in localStorage
        };

        mediaRecorder.start();
    } catch (err) {
        console.error("Error starting screen recording:", err);
    }
}

// Stop screen recording
function stopScreenRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}