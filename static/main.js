document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const playButton = document.getElementById('playButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const recordingDuration = document.getElementById('recordingDuration');
    const chatContainer = document.querySelector('.chat-container');

    let mediaRecorder;
    let chunks = [];

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            recordButton.addEventListener('click', startRecording);
            stopButton.addEventListener('click', stopRecording);
            playButton.addEventListener('click', playRecording);

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
        })
        .catch(error => console.error('Error accessing microphone:', error));

    function startRecording() {
        chunks = [];
        mediaRecorder.start();
        recordButton.disabled = true;
        stopButton.disabled = false;
        playButton.disabled = true;
        recordingDuration.innerHTML = 'Recording...';
    }

    function stopRecording() {
        mediaRecorder.stop();
        recordButton.disabled = false;
        stopButton.disabled = true;
        playButton.disabled = false;
        recordingDuration.innerHTML = 'Recording stopped.';
        sendMessage('Voice Message', 'user');
    }

    function playRecording() {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        audioPlayer.src = url;
        audioPlayer.play();
    }

    function sendMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.innerHTML = message;
        if (sender === 'user') {
            messageDiv.addEventListener('click', playUserMessage);
            messageDiv.setAttribute('data-audio', chunks);
        }
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom of the chat
        // Send the message to the server or perform further actions as needed
    }

    function playUserMessage(event) {
        const audioData = event.currentTarget.getAttribute('data-audio');
        if (audioData) {
            const blob = new Blob(audioData, { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            audioPlayer.src = url;
            audioPlayer.play();
        }
    }
});