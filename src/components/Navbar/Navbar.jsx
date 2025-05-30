// src/components/Navbar/Navbar.jsx
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logoImg from '../../assets/logo.png';
import navBgImg from '../../assets/nav_bg.png';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!jwtToken);
  }, []);

  const handleLogout = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('jwtToken');
        alert('로그아웃되었습니다.');
        setIsLoggedIn(false);
        window.location.href = '/login.html';
      } else {
        alert('로그아웃에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className="nav_bg" style={{ backgroundImage: `url(${navBgImg})` }}>
        <div className="header">
          <div className="logoArea">
            <a href="/"><img src={logoImg} alt="Main Logo" /></a>
          </div>
          <ul className="nav">
            <li><a href="#">상담</a></li>
            <li><a href="#">자가진단</a></li>
            <li><a href="#">마인드케어</a></li>
            <li><a href="#">커뮤니티</a></li>
            <li><a href="#">마이페이지</a></li>

            {isLoggedIn ? (
              <>
                <li className="logout"><a href="#" onClick={handleLogout}>로그아웃</a></li>
              </>
            ) : (
              <>
                <li id="authAction" className="login"><a href="/login.html">로그인</a></li>
                <span id="authDivider" style={{ color: '#fff' }}> / </span>
                <li id="registerAction" className="register"><a href="/join_agree.html">회원가입</a></li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="dropdown">
        <div className="dropdown-content">
          <div className="dropdown-section">
            <button onClick={() => window.location.href = 'medical_booking.html'}>채팅 상담</button>
            <button onClick={() => window.location.href = 'medical_exam_booking.html'}>음성 상담</button>
          </div>
          <div className="dropdown-section">
            <button onClick={() => window.location.href = 'online_booking.html'}>자가진단</button>
          </div>
          <div className="dropdown-section">
            <button onClick={() => window.location.href = 'hospital_information.html'}>명상</button>
            <button onClick={() => window.location.href = 'location_and_pharmacies.html'}>치료센터/병원위치</button>
          </div>
          <div className="dropdown-section">
            <button onClick={() => window.location.href = 'notice.html'}>공지사항</button>
            <button onClick={() => window.location.href = 'health_magazine.html'}>커뮤니티</button>
            <button onClick={() => window.location.href = 'receiving_suggestion.html'}>건의사항</button>
            <button onClick={() => window.location.href = 'notice.html'}>카드뉴스</button>
          </div>
          <div className="dropdown-section">
            <button onClick={() => window.location.href = 'reservation_info.html'}>개인정보 수정</button>
            <button onClick={() => window.location.href = 'modify.html'}>챗봇 상담 내역 확인</button>
            <button onClick={() => window.location.href = 'qusetionnaire.html'}>자가진단 내역 확인</button>
            <button onClick={() => window.location.href = 'reservation_info.html'}>호전상태</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
