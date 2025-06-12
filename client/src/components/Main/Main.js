import React from "react";
import { Link } from "react-router-dom"; // 추가
import "./Main.css";
import b1Image from '../../Images/b1.png';
import b2Image from '../../Images/b2.png';
import b3Image from '../../Images/b3.png';
import b4Image from '../../Images/b4.png';

function Main() {
  return (
    <div className="container">
      <div className="wrap_box">
        <div className="box">
          <Link to="/chat">
            <div className="main_icon">
              <img src={b1Image} alt="상담" />
            </div>
            <p>상담</p>
            <span className="arrow">→</span>
          </Link>
        </div>
        <div className="box">
          <Link to="/diagnosis">
          <div className="main_icon">
            <img src={b2Image} alt="자가진단" />
          </div>
          <p>자가진단</p>
          <span className="arrow">→</span>
        </Link>
        </div>
        <div className="box">
          <div className="main_icon">
            <img src={b3Image} alt="마인드케어" />
          </div>
          <p>치료센터/병원위치</p>
          <span className="arrow">→</span>
        </div>
        <div className="box">
          <Link to='/community'>
          <div className="main_icon">
            <img src={b4Image} alt="커뮤니티" />
          </div>
          <p>커뮤니티</p>
          <span className="arrow">→</span>
          </Link>
        </div>
        <div className="box">
          <div className="main_icon">
            <img src={b1Image} alt="마이페이지" />
          </div>
          <p>마이페이지</p>
          <span className="arrow">→</span>
        </div>
        <div className="box">
          <div className="main_icon">
            <img src={b2Image} alt="로그인" />
          </div>
          <p>로그인</p>
          <span className="arrow">→</span>
        </div>
      </div>
    </div>
  );
}

export default Main;
