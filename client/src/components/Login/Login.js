import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import kakaoLoginImg from '../../Images/kakao_login.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAdmin) {
      // 관리자 로그인
      try {
        const response = await axios.post('/api/admins/login', {
          userEmail: email,
          password: password
        });

        console.log("관리자 로그인 성공:", response.data);

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userEmail', response.data.userEmail);
        localStorage.setItem('userRole', response.data.role); // ADMIN 저장
        
        // localStorage.setItem('userNickname', response.data.userEmail); 

        alert(response.data.message || '관리자 로그인 성공!');
        
        navigate(response.data.nextStep || '/'); 

      } catch (error) {
        console.error("관리자 로그인 실패:", error.response ? error.response.data : error.message);
        alert('로그인 실패. 이메일과 비밀번호를 확인해 주세요.');
      }
    } else {
      // 사용자 로그인
      try {
        const loginResponse = await axios.post('/api/users/login', {
          userEmail: email,
          password: password
        });

        console.log("로그인 성공:", loginResponse.data);

        const { token, role } = loginResponse.data;
        const userEmail = loginResponse.data.userEmail || email;

        if (!token) {
          console.error("로그인 응답에 토큰이 누락되었습니다.");
          alert('로그인에 실패했습니다. (서버 응답 오류)');
          return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', userEmail);
        if (role) {
          localStorage.setItem('userRole', role); // USER 저장
        }

        try {
          const profileResponse = await axios.get('/api/mypage/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("프로필 정보 응답:", profileResponse.data);

          const userNickname = profileResponse.data.nickname || profileResponse.data.userName;
          const userId = profileResponse.data.userEmail;

          if (userNickname) {
            localStorage.setItem('userNickname', userNickname);
          }
          if (userId) {
            localStorage.setItem('userId', userEmail);
          }

        } catch (profileError) {
          console.error("프로필 정보 로딩 실패:", profileError.response ? profileError.response.data : profileError.message);
          alert('로그인은 성공했으나, 프로필 정보를 가져오는 데 실패했습니다.');
        }
        
        alert('로그인 성공!');
        navigate('/');

      } catch (error) {
        console.error("로그인 실패:", error.response ? error.response.data : error.message);
        alert('로그인 실패. 이메일과 비밀번호를 확인해 주세요.');
      }
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = 'http://13.125.43.47:8080/api/oauth/kakao/login';
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

        <div className="admin-checkbox-container">
          <input
            type="checkbox"
            id="adminCheck"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <label htmlFor="adminCheck">관리자 로그인</label>
        </div>

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