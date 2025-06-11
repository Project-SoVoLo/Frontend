import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import "./Chatbot.css";
import axios from "../../api/axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationPhase, setConversationPhase] = useState("waiting_start");
  // waiting_start : 사용자가 챗봇 화면에 처음 들어오면 챗봇이 먼저 말 건넴, 아무런 api도 호출하지 않음
  // started : 사용자가 안녕? 하면 /start-chat 호출
  // ongoing : 그 이후 로직 진행
  const sender = localStorage.getItem("userEmail");

  // 1. 대화 시작 (화면 진입 시 챗봇이 시작, api 호출 없음)
  useEffect(() => {
    setMessages([{ from: "bot", text: "대화를 시작합니다. 안녕이라고 말해보세요!" }]);
}, []);


  // 2. 사용자 메시지 전송 (사용자 입력에 대해 단계별로 처리)
  const handleSend = async (text) => {
    const newMessages = [...messages, { from: "user", text }];
    setMessages(newMessages);
    setLoading(true);

    // 🔁 대화 단계별 API 경로 결정
    let apiUrl = "";
    let nextPhase = conversationPhase;

    if (conversationPhase === "waiting_start") {
      apiUrl = "/api/chatbot/start-chat";
      nextPhase = "started";
    } else if (conversationPhase === "started") {
      apiUrl = "/api/chatbot/full"; // 감정 분석 포함
      nextPhase = "ongoing";
    } else {
      apiUrl = "/api/chatbot/continue"; // 감정 유지, 응답만
    }

    try {
      const res = await axios.post(apiUrl, { text, sender });
      // 이 줄을 추가해봐 (axios.post 바로 아래)
      console.log("🧾 Rasa 응답:", res.data);

      const rasaResponses = res.data.response;

      // Rasa 응답이 배열일 경우 (대화연장 or metadata.action_name 포함 가능)
      const botMessages = Array.isArray(rasaResponses)
        ? rasaResponses.map((msg) => ({
            from: "bot",
            text: msg.text || "",
            action: msg.metadata?.action_name || null,
          }))
        : [{ from: "bot", text: rasaResponses || "챗봇 응답 없음" }];

      const updatedMessages = [...newMessages, ...botMessages];
      setMessages(updatedMessages);

      setConversationPhase(nextPhase);  // 다음 상태로 변경

      // 종료 응답이면 대화 요약 저장 (/chat-summaries)
      if (isEndAction(botMessages)) {
        await saveChatSummary(updatedMessages);
      }
    } catch (err) {
      setMessages([...newMessages, { from: "bot", text: "서버 응답 실패" }]);
    }
    setLoading(false);
  };

  // 종료 액션 이름 확인 (Rasa 커스텀 액션 이름 기준)
  const isEndAction = (responses) => {
    return responses.some(
      (res) =>
        res.action === "utter_end_chat_positive" ||
        res.action === "utter_end_chat_neutral" ||
        res.action === "utter_end_chat_negative"
    );
  };

  // 요약 저장 요청 (\n으로 묶어서 /chat-summaries 요청하는 메소드)
  const saveChatSummary = async (finalMessages) => {
    const chatLog = finalMessages
      .map((msg) => `${msg.from === "user" ? "나" : "챗봇"}: ${msg.text}`)
      .join("\n");

    try {
      await axios.post("/api/mypage/chat-summaries", { chatLog });
      console.log("✅ 대화 요약 저장 완료");
    } catch (err) {
      console.error("❌ 요약 저장 실패", err);
    }
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
