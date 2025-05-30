import React from 'react';

const tabs = [
  { key: 'counseling', label: '상담내역' },
  { key: 'selftest', label: '자가진단내역' },
  { key: 'emotion', label: '호전상태' },
  { key: 'editprofile', label: '개인정보수정' },
];

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <ul>
      {tabs.map(tab => (
        <li
          key={tab.key}
          data-tab={tab.key}
          className={activeTab === tab.key ? 'active' : ''}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </li>
      ))}
    </ul>
  );
}

export default Sidebar;
