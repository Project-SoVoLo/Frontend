import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import "./Chatbot.css";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "첫번째 대화를 시작합니다." },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text) => {
    const newMessages = [...messages, { from: "user", text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/chatbot/full", {
        message: text,
      });
      const data = response.data;
      if (data.text) {
        setMessages([...newMessages, { from: "bot", text: data.text }]);
      } else {
        setMessages([
          ...newMessages,
          { from: "bot", text: data.error || "챗봇 응답 실패" }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { from: "bot", text: "서버 연결 실패" }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} from={msg.from} text={msg.text} />
        ))}
        {loading && <ChatMessage from="bot" text="챗봇이 답변을 작성 중입니다..." />}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
