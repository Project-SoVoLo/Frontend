import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      axios.post('/api/oauth/kakao/token', {
        code: code,
        redirect_uri: 'http://localhost:3000/kakao/callback'
      })
      .then(response => {
        console.log("카카오 토큰 발급 성공:", response.data);
        localStorage.setItem('token', response.data.token);
        navigate('/login-extra-info');
      })
      .catch(error => {
        console.error("카카오 토큰 발급 실패:", error.response ? error.response.data : error.message);
        alert('카카오 로그인 실패');
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
