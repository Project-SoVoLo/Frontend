import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import kakaoLoginImg from '../../Images/kakao_login.png'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('이메일:', email);
    console.log('비밀번호:', password);
    alert('로그인 시도됨');
  };

  const handleKakaoLogin = () => {
    window.location.href = '/api/oauth/kakao/login';
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
