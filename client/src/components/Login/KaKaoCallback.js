import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 카카오 로그인 한 사용자 정보 디버깅
    console.log("👉 token:", localStorage.getItem("token"));
    console.log("👉 userEmail:", localStorage.getItem("userEmail"));


    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
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
        setTimeout(() => navigate(destination), 100);   // 저장되고 이동하도록 약간 지연
      })
      .catch(error => {
        console.error("카카오 토큰 발급 실패:", error.response ? error.response.data : error.message);
        alert('카카오 로그인 실패');
        navigate('/login');
      });
    }
  }, [navigate]);

  return (
    <div>
      <h2>카카오 로그인 처리 중...</h2>
    </div>
  );
}

export default KakaoCallback;
