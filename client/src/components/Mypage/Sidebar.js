import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Mypage.css';

const tabs = [
  { key: 'counseling', label: '상담내역', description:'챗봇과의 상담내용요약' },
  { key: 'self_test', label: '자가진단내역', description:'자가 진단 확인'},
  { key: 'emotion_chart', label: '호전상태', description:'감정 점수를 나타낸 그래프' },
  { key: 'edit_profile', label: '개인정보수정'},
];

function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleTabClick = (key) => {
    setActiveTab(key);
    navigate(`/mypage?tab=${key}`);
  };

  return (
    <div className="button-container">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`sidebar-item ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.key)}
        >
          <h3>{tab.label}</h3>
          <p>{tab.description}</p>
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
