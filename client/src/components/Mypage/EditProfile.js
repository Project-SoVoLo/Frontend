import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './Mypage.css';

function EditProfile() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');

    window.dispatchEvent(new Event('loginStateChange'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !nickname || !phone) {
      alert("입력 오류: 이메일, 이름, 닉네임, 휴대전화번호는 필수입니다.");
      return;
    }
    try {
      await axios.post('/api/users/edit-info', {
        newEmail: email,
        newPassword: password,
        userName: name,
        nickname: nickname,
        userPhone: phone,
      });

      alert('개인정보 변경 성공! 다시 로그인해 주세요.');
      handleLogout();
      navigate('/login', { replace: true });

    } catch (error) {
      const errorMessage = error.response?.data?.error || '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.';
      alert('개인정보 변경 실패: ' + errorMessage);
    }
  };

  // 유저 정보 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/mypage/profile');

        if (res.data) {
          setEmail(res.data.userEmail || '');
          setName(res.data.userName || '');
          setNickname(res.data.nickname || '');
          setPhone(res.data.userPhone || '');
        }
      } catch (err) {
        alert("오류: 계정 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="tab-content active"><h3>로딩 중...</h3></div>;
  }

  return (
    <div className="tab-content active">
      <form className="profileForm" onSubmit={handleSubmit}>
        <h1 className="title">개인정보 변경</h1>
        <table className="profile-table">
          <tbody>
            <tr>
              <th><label htmlFor="email">이메일</label></th>
              <td>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                />
              </td>
            </tr>

            <tr>
              <th><label htmlFor="password">비밀번호</label></th>
              <td>
                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder="변경할 새 비밀번호 (선택)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </td>
            </tr>

            <tr>
              <th><label htmlFor="name">이름</label></th>
              <td>
                <input
                  id="name"
                  className="input"
                  type="text"
                  placeholder="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </td>
            </tr>

            <tr>
              <th><label htmlFor="nickname">닉네임</label></th>
              <td>
                <input
                  id="nickname"
                  className="input"
                  type="text"
                  placeholder="닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </td>
            </tr>

            <tr>
              <th><label htmlFor="phone">휴대전화번호</label></th>
              <td>
                <input
                  id="phone"
                  className="input"
                  type="tel"
                  placeholder="휴대전화번호 (예: 01012345678)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" className="button">
          정보 변경
        </button>
      </form>
    </div>
  );
}

export default EditProfile;