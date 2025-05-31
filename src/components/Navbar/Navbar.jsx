import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 라우터 훅 추가
import './Navbar.css';
import logoImg from '../../assets/logo.png';
import navBgImg from '../../assets/nav_bg.png';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // ✅ 라우터 훅 선언

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
        navigate('/login'); // ✅ 수정된 부분
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
            <a href="#" onClick={() => navigate('/')}>
              <img src={logoImg} alt="Main Logo" />
            </a>
          </div>
          <ul className="nav">
            <li><a href="#" onClick={() => navigate('/chat')}>상담</a></li>
            <li><a href="#" onClick={() => navigate('/selfcheck')}>자가진단</a></li>
            <li><a href="#" onClick={() => navigate('/meditation')}>마인드케어</a></li>
            <li><a href="#" onClick={() => navigate('/community')}>커뮤니티</a></li>
            <li><a href="#" onClick={() => navigate('/mypage')}>마이페이지</a></li>

            {isLoggedIn ? (
              <li className="logout">
                <a href="#" onClick={handleLogout}>로그아웃</a>
              </li>
            ) : (
              <>
                <li id="authAction" className="login">
                  <a href="#" onClick={() => navigate('/login')}>로그인</a>
                </li>
                <span id="authDivider" style={{ color: '#fff' }}> / </span>
                <li id="registerAction" className="register">
                  <a href="#" onClick={() => navigate('/join_agree')}>회원가입</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="dropdown">
        <div className="dropdown-content">
          <div className="dropdown-section">
            <button onClick={() => navigate('/medical_booking')}>채팅 상담</button>
            <button onClick={() => navigate('/medical_exam_booking')}>음성 상담</button>
          </div>
          <div className="dropdown-section">
            <button onClick={() => navigate('/online_booking')}>자가진단</button>
          </div>
          <div className="dropdown-section">
            <button onClick={() => navigate('/hospital_information')}>명상</button>
            <button onClick={() => navigate('/location_and_pharmacies')}>치료센터/병원위치</button>
          </div>
          <div className="dropdown-section">
            <button onClick={() => navigate('/notice')}>공지사항</button>
            <button onClick={() => navigate('/health_magazine')}>커뮤니티</button>
            <button onClick={() => navigate('/receiving_suggestion')}>건의사항</button>
            <button onClick={() => navigate('/card_news')}>카드뉴스</button>
          </div>
          <div className="dropdown-section">
            <button onClick={() => navigate('/reservation_info')}>개인정보 수정</button>
            <button onClick={() => navigate('/modify')}>챗봇 상담 내역 확인</button>
            <button onClick={() => navigate('/questionnaire')}>자가진단 내역 확인</button>
            <button onClick={() => navigate('/recovery_state')}>호전상태</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
