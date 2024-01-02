document.addEventListener("DOMContentLoaded", function () {
  const recordButton = document.getElementById("recordButton");
  const stopButton = document.getElementById("stopButton");
  const playButton = document.getElementById("playButton");
  const audioPlayer = document.getElementById("audioPlayer");
  const chatContainer = document.querySelector(".chat-container");

  let mediaRecorder;
  let chunks = [];

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);

      recordButton.addEventListener("click", startRecording);
      stopButton.addEventListener("click", stopRecording);
      playButton.addEventListener("click", playRecording);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
    })
    .catch((error) => console.error("Error accessing microphone:", error));

  function startRecording() {
    chunks = [];
    mediaRecorder.start();
    recordButton.disabled = true;
    stopButton.disabled = false;
    playButton.disabled = true;
  }

  function stopRecording() {
    mediaRecorder.stop();
    recordButton.disabled = false;
    stopButton.disabled = true;
    playButton.disabled = false;
    sendMessage("Voice Message", "user", chunks);
  }

  function playRecording() {
    const blob = new Blob(chunks, { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    audioPlayer.src = url;
    audioPlayer.play();
  }

  function sendMessage(message, sender, audioChunks) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-messages");

    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add(
      "message",
      sender === "user" ? "user-message" : "bot-message"
    );
    const xyzDiv = document.createElement("div");
    xyzDiv.classList.add("xyz");

    const playIcon = document.createElement("div");
    playIcon.classList.add("play-icon");

    const messageContentDiv = document.createElement("div");
    messageContentDiv.classList.add("message-content");

    userMessageDiv.appendChild(playIcon);
    messageContentDiv.textContent = message;
    userMessageDiv.appendChild(messageContentDiv);

    messageDiv.appendChild(userMessageDiv);
    messageDiv.appendChild(xyzDiv);

    if (sender === "user") {
      messageDiv.addEventListener("click", () => playUserMessage(audioChunks));
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function playUserMessage(audioChunks) {
    if (audioChunks && audioChunks.length > 0) {
      const blob = new Blob(audioChunks, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      audioPlayer.src = url;
      audioPlayer.play();
    }
  }
});
