import React from "react";
import "./ChatMessage.css";

export default function ChatMessage({ from, text }) {
  return (
    <div className={`chat-message ${from}`}>
      {from === "bot" && (
        <span className="bot-icon">😊</span>
      )}
      <div className="message-text">{text}</div>
    </div>
  );
}
