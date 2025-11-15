import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Main.css";

import b1Image from "../../Images/b1.png";
import b2Image from "../../Images/b2.png";
import b3Image from "../../Images/b3.png";
import b4Image from "../../Images/b4.png";
import fortuneCookie from "../../Images/fortune.png";

function Main() {
  const [openModal, setOpenModal] = useState(false);
  const [fortune, setFortune] = useState("");

  const fortunes = [
    "오늘은 네가 생각한 것보다 더 좋은 날이 될 거야 😊",
    "너의 노력은 반드시 결과로 돌아와! ✨",
    "행운이 가까이 와 있어. 너무 멀리 찾지 마! 🍀",
    "따뜻한 말 한마디가 큰 기적을 만들 거야 💛",
    "오늘은 새로운 기회가 열리는 날이야 🚪",
  ];

  const openFortuneModal = () => {
    const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortune(pick);
    setOpenModal(true);
  };

  return (
    <div className="container">
      <div className="wrap_box">

        { }
        <div className="box">
          <Link to="/chat">
            <div className="icon"><img src={b1Image} alt="상담" /></div>
            <p>상담</p>
            <span className="arrow">→</span>
          </Link>
        </div>

        <div className="box">
          <Link to="/diagnosis">
            <div className="icon"><img src={b2Image} alt="자가진단" /></div>
            <p>자가진단</p>
            <span className="arrow">→</span>
          </Link>
        </div>

        <div className="box">
          <Link to="/location">
            <div className="icon"><img src={b3Image} alt="치료센터" /></div>
            <p>치료센터/병원위치</p>
            <span className="arrow">→</span>
          </Link>
        </div>

        { }
        <div></div>

        <div className="fortune-center" onClick={openFortuneModal}>
          <img src={fortuneCookie} alt="fortune" className="fortune-icon" />
        </div>

        <div></div>

        { }
        <div className="box">
          <Link to="/community">
            <div className="icon"><img src={b4Image} alt="커뮤니티" /></div>
            <p>커뮤니티</p>
            <span className="arrow">→</span>
          </Link>
        </div>

        <div className="box">
          <Link to="/mypage">
            <div className="icon"><img src={b1Image} alt="마이페이지" /></div>
            <p>마이페이지</p>
            <span className="arrow">→</span>
          </Link>
        </div>

        <div className="box">
          <Link to="/login">
            <div className="icon"><img src={b2Image} alt="로그인" /></div>
            <p>로그인</p>
            <span className="arrow">→</span>
          </Link>
        </div>
      </div>

      {/* 운세 모달 */}
      {openModal && (
        <div className="fortune-modal-backdrop">
          <div className="fortune-modal-card">
            <h2 className="fortune-title">오늘의 운세</h2>
            <p className="fortune-text">{fortune}</p>

            <button className="fortune-btn" onClick={() => setOpenModal(false)}>
              닫기
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Main;
