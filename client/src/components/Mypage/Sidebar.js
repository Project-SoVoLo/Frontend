import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const tabs = [
  { key: 'counseling', label: '상담내역' },
  { key: 'self_test', label: '자가진단내역' },
  { key: 'emotion_chart', label: '호전상태' },
  { key: 'edit_profile', label: '개인정보수정' },
];

function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleTabClick = (key) => {
    setActiveTab(key);
    navigate(`/mypage?tab=${key}`);
  };

  return (
    <ul className="sidebar">
      {tabs.map(tab => (
        <li
          key={tab.key}
          className={`sidebar-item ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.key)}
        >
          {tab.label}
        </li>
      ))}
    </ul>
  );
}

export default Sidebar;
