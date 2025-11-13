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
      // 1. 첫 번째 로그인 요청
      const loginResponse = await axios.post('/api/users/login', {
        userEmail: email,
        password: password
      });

      console.log("로그인 성공:", loginResponse.data);

      // 2. 로그인 응답에서 토큰, 이메일, 역할 추출
      // (login.tsx는 email을 입력값에서 가져오지만, Login.js는 응답에서 받는 로직이 있었으므로 둘 다 고려)
      const { token, role } = loginResponse.data;
      const userEmail = loginResponse.data.userEmail || email; // 응답에 이메일이 있으면 사용, 없으면 입력값 사용

      if (!token) {
        console.error("로그인 응답에 토큰이 누락되었습니다.");
        alert('로그인에 실패했습니다. (서버 응답 오류)');
        return;
      }

      // 3. 토큰, 이메일, 역할 우선 저장
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', userEmail);
      if (role) {
        localStorage.setItem('role', role);
      }

      // 4. [login.tsx 방식] 토큰을 사용하여 프로필 정보(닉네임, userId)를 별도로 요청
      try {
        const profileResponse = await axios.get('/api/mypage/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
          },
        });

        console.log("프로필 정보 응답:", profileResponse.data);

        // 5. 프로필 응답에서 닉네임과 userId 추출
        // (login.tsx는 'nickname' 키를 사용하지만, 원본 Login.js는 'userName'을 참조하려 했으므로 둘 다 확인)
        const userNickname = profileResponse.data.nickname || profileResponse.data.userName;
        const userId = profileResponse.data.userEmail;

        if (userNickname) {
          // 원본 Login.js가 사용하던 'userNickname' 키로 저장
          localStorage.setItem('userNickname', userNickname);
        }
        if (userId) {
          localStorage.setItem('userId', userEmail);
        }

      } catch (profileError) {
        console.error("프로필 정보 로딩 실패:", profileError.response ? profileError.response.data : profileError.message);
        // 프로필 로딩에 실패해도 로그인은 성공한 것으로 처리할 수 있음
        alert('로그인은 성공했으나, 프로필 정보를 가져오는 데 실패했습니다.');
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