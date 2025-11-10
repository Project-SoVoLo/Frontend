import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import kakaoLoginImg from '../../Images/kakao_login.png'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // 로그인 성공 시 페이지 이동

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', {
        userEmail: email,
        password: password
      });

      console.log("로그인 API 실제 응답:", JSON.stringify(response.data));
      console.log("로그인 성공:", response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);

      if (response.data.userName) {
         localStorage.setItem('userName', response.data.userName);
      } else if (response.data.userInfo && response.data.userInfo.userName) {
         localStorage.setItem('userName', response.data.userInfo.userName);
      }

      if (response.data.role) {
        localStorage.setItem('role', response.data.role); // 예: "USER" 또는 "ADMIN"
      }
      alert('로그인 성공!');
      // 메인 페이지로 이동
      navigate('/');
    } catch (error) {
      console.error("로그인 실패:", error.response ? error.response.data : error.message);
      alert('로그인 실패. 이메일과 비밀번호를 확인해 주세요.');
    }
  };

  const handleKakaoLogin = () => {
      window.location.href = 'http://localhost:8080/api/oauth/kakao/login'; //절대경로 
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button id="login" type="submit">로그인</button>
        <button id="kakao-login" type="button" onClick={handleKakaoLogin}>
          <img src={kakaoLoginImg} alt="카카오 로그인" />
        </button>
        <Link to="/join">
          <button id="join" type="button">회원가입</button>
        </Link>
      </form>
    </div>
  );
}

export default Login;