// src/components/Navbar/NavbarAdmin.jsx
import React, { useEffect, useState } from 'react';
import './NavbarAdmin.css';
import logoImg from '../../assets/logo.png';
import navBgImg from '../../assets/nav_bg.png';
import { useNavigate } from 'react-router-dom';
const NavbarAdmin = () => {
  const [jwtToken, setJwtToken] = useState(null);
  const navigate = useNavigate(); 
  // 컴포넌트가 처음 렌더링될 때 JWT 토큰을 로드
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setJwtToken(token);
  }, []);

  // 로그아웃 핸들러
  const handleLogout = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('이미 로그아웃되었습니다.');
      window.location.href = '/login.html';
      return;
    }

    const baseUrl = ''; // 여기에 백엔드 API 주소 입력

    try {
      const response = await fetch(`${baseUrl}/api/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('로그아웃 성공');
        localStorage.removeItem('jwtToken');
        alert('로그아웃되었습니다.');
        window.location.href = '/login.html';
      } else {
        console.error('로그아웃 실패:', response.status);
        alert('로그아웃 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
      alert('네트워크 오류로 로그아웃할 수 없습니다.');
    }
  };

  return (
    <div className="nav_bg" style={{ backgroundImage: `url(${navBgImg})` }}>
      <div className="header">
        <div className="logoArea">
          <a href="#"><img src={logoImg} alt="Main Logo" /></a>
        </div>
        <ul className="nav">
          <li><a href="admin_users.html">사용자정보 관리</a></li>
          <li><a href="admin_feedback.html">건의사항 확인</a></li>
          <li><a href="admin_meditation.html">명상 업로드</a></li>
          <li><a href="admin_location.html">병원위치 관리</a></li>
          <li><a href="admin_notice.html">공지사항 작성</a></li>
          <li><a href="admin_cardnews.html">카드뉴스 작성</a></li>
          <li className="logout">
            <a href="#" id="logoutButton" onClick={handleLogout}>로그아웃</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarAdmin;
