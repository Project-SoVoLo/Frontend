// src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css'; // 스타일은 따로 관리
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 실제 로그인 API 호출 또는 인증 로직 작성
    console.log('이메일:', email);
    console.log('비밀번호:', password);
    alert('로그인 시도됨');
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
        <button id = "login" type="submit">로그인</button>
        <Link to='/join'>
        <button id = "join">회원가입</button>
        </Link>
      </form>
    </div>
  );
}

export default Login;
