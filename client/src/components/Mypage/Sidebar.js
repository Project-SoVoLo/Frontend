import React from 'react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { key: 'counseling', label: '상담내역' },
  { key: 'self_test', label: '자가진단내역' },
  { key: 'emotion_chart', label: '호전상태' },
  { key: 'edit_profile', label: '개인정보수정' },
];

function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleTabClick = (key) => {
    setActiveTab(key);                // 내부 상태 변경
    navigate(`/mypage?tab=${key}`);  // URL 쿼리도 변경
  };

  return (
    <ul>
      {tabs.map(tab => (
        <li
          key={tab.key}
          className={activeTab === tab.key ? 'active' : ''}
          onClick={() => handleTabClick(tab.key)}
        >
          {tab.label}
        </li>
      ))}
    </ul>
  );
}

export default Sidebar;