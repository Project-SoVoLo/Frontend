import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './LoginExtraInfo.css';

function LoginExtraInfo() {
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("폼 제출됨:", { gender, birth, phone });

      // 인터셉터로 토큰 자동 추가
      await axios.post('/api/users/update-info', {
        userGender: gender,
        userBirth: birth,
        userPhone: phone
      });

      alert('추가 정보 저장 완료');
      navigate('/');
    } catch (error) {
      console.error('추가 정보 저장 실패:', error.response ? error.response.data : error.message);
      alert('추가 정보 저장 실패');
    }
  };

  return (
    <div className="login-extra-info-container">
      <h2 className="login-extra-info-title">추가 정보 입력</h2>
      <form className="login-extra-info-form" onSubmit={handleSubmit}>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">성별 선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
        <input
          type="text"
          placeholder="생년월일 (예: 19980101)"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="휴대폰번호 (예: 01012345678)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">완료</button>
      </form>
    </div>
  );
}

export default LoginExtraInfo;