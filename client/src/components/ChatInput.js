import React, { useState, useRef } from "react";
import './ChatInput.css';

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const [whisperRecording, setWhisperRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleWhisperStop = async () => {
    if (audioChunksRef.current.length === 0) {
      setWhisperRecording(false);
      return;
    }
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    if (audioBlob.size === 0) {
      setWhisperRecording(false);
      return;
    }
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const response = await fetch("http://localhost:5001/api/whisper", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.text) {
        setInput(prev => (prev ? prev + " " : "") + data.text);
      } else {
        alert(data.error || "음성 인식 실패");
      }
    } catch (err) {
      alert("Whisper 서버 연결 실패");
    }
    setWhisperRecording(false);
  };

  const handleWhisperToggle = async () => {
    if (!whisperRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new window.MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = handleWhisperStop;
        mediaRecorderRef.current.start();
        setWhisperRecording(true);
      } catch (err) {
        alert("마이크 권한이 필요합니다.");
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleComposition = (e) => {
    if (e.type === 'compositionstart') setIsComposing(true);
    if (e.type === 'compositionend') setIsComposing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing && !whisperRecording) {
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="메시지를 입력하세요"
        disabled={whisperRecording}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleComposition}
        onCompositionEnd={handleComposition}
        className="chat-input-text"
      />
      <button onClick={handleSend} aria-label="전송" className="send-btn">
        <span role="img" aria-label="전송">✈️</span>
      </button>
      <button
        onClick={handleWhisperToggle}
        aria-pressed={whisperRecording}
        aria-label={whisperRecording ? "Whisper 음성 입력 중지" : "Whisper 음성 입력 시작"}
        className={`voice-btn${whisperRecording ? " voice-active" : ""}`}
        style={{ marginLeft: 4 }}
      >
        {whisperRecording ? "🛑 Whisper" : "🎙️ Whisper"}
      </button>
    </div>
  );
}
