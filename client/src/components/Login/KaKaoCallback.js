import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function KakaoCallback() {
  const navigate = useNavigate();
  const calledRef = useRef(false); // 요청 중복 방지

  useEffect(() => {
    // 카카오 로그인 한 사용자 정보 디버깅
    console.log("👉 token:", localStorage.getItem("token"));
    console.log("👉 userEmail:", localStorage.getItem("userEmail"));

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // 요청 중복 방지 처리
    if (!code || calledRef.current) return;
    calledRef.current = true;

    axios.post('/api/oauth/kakao/token', {
      code: code,
      redirect_uri: 'http://localhost:3000/kakao/callback'
    })
    .then(response => {
      const { token, nextStep, userEmail } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', userEmail);
      }

      // 기본 fallback 경로
      const destination = nextStep || '/home';
      setTimeout(() => navigate(destination), 100); // 저장 후 이동
    })
    .catch(error => {
      console.error("카카오 토큰 발급 실패:", error.response ? error.response.data : error.message);
      alert('카카오 로그인 실패');
      navigate('/login');
    });
  }, [navigate]);

  return (
    <div>
      <h2>카카오 로그인 처리 중...</h2>
    </div>
  );
}

export default KakaoCallback;
