import React from "react";
import "./FortuneModal.css";

function FortuneModal({ fortune, onClose }) {
  return (
    <div className="fortune-modal-backdrop">
      <div className="fortune-modal-card">
        <h2 className="fortune-title">오늘의 운세</h2>
        <p className="fortune-text">{fortune}</p>

        <button className="fortune-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default FortuneModal;
