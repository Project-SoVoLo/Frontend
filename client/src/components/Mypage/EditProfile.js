import React, { useState } from 'react';
import './Mypage.css';

function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    phone: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) alert('정보가 성공적으로 변경되었습니다!');
        else alert('변경 실패: ' + result.message);
      })
      .catch(() => alert('서버 오류가 발생했습니다.'));
  };

  return (
    <div className="tab-content active">
      <form id="profileForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">전화번호</label>
          <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <button type="submit">변경</button>
      </form>
    </div>
  );
}

export default EditProfile;