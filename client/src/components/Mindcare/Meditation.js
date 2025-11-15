import React from "react";
import "./Meditation.css";

function Meditation() {
  return (
    <div className="meditation-container">
      <h2 className="meditation-title">마음이 편안해지는 명상 영상</h2>

      <div className="video-grid">
        <iframe
          src="https://www.youtube.com/embed/1ZYbU82GVz4"
          title="Meditation Video 1"
          allowFullScreen
        ></iframe>

        <iframe
          src="https://www.youtube.com/embed/inpok4MKVLM"
          title="Meditation Video 2"
          allowFullScreen
        ></iframe>

        <iframe
          src="https://www.youtube.com/embed/aEqlQvczMJQ"
          title="Meditation Video 3"
          allowFullScreen
        ></iframe>

        <iframe
          src="https://www.youtube.com/embed/ZToicYcHIOU"
          title="Meditation Video 4"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default Meditation;
